function fillParams(
  searchParams: URLSearchParams,
  params?: Record<string, string>
) {
  if (!params) return;
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key]);
  });
}

function copyHeaders(headers: Headers, sourceHeaders?: Record<string, string>) {
  if (!sourceHeaders) return;
  Object.entries(sourceHeaders).forEach(([key, value]) => {
    headers.append(key, value);
  });
}

interface Interceptor<T = any> {
  onfulfilled?: (value: T) => T | Promise<T>;
  onrejected?: (error: any) => any;
  runWhen?: (config: T) => boolean;
}

class InterceptorManager<T = any> {
  handlers: Interceptor<T>[] = [];

  use(
    onfulfilled?: (value: T) => T | Promise<T>,
    onrejected?: (error: any) => any,
    options?: { runWhen?: (config: T) => boolean }
  ) {
    this.handlers.push({ onfulfilled, onrejected, ...options });
    return this.handlers.length - 1;
  }

  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.handlers.forEach(fn);
  }
}

interface HTTPClientConfig {
  base: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
}

interface RequestOptions {
  body?: BodyInit | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  integrity?: string;
  keepalive?: boolean;
  method?: string;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal;
  window?: any;
  params?: Record<string, string>;
  data?: any;
}

const RESPONSE_STATUS = {
  NO_CONTENT: 204,
};

export class HTTPClient {
  interceptors: {
    request: InterceptorManager<Request>;
    response: InterceptorManager<Response>;
  };
  private _config: HTTPClientConfig;

  constructor(config: HTTPClientConfig) {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
    this._config = config;
  }

  async dispatchRequest(req: Request): Promise<Response> {
    try {
      const input = typeof req === "string" ? req : req.url;
      const response = await fetch(input, req);
      (response as any).request = req;
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async do(
    resource: string | URL | Request,
    options?: RequestOptions
  ): Promise<Response> {
    let url: URL;
    if (typeof resource === "string" || resource instanceof URL) {
      url = new URL(resource.toString(), this._config.base);
    } else if (resource instanceof Request) {
      url = new URL(resource.url, this._config.base);
    } else {
      return Promise.reject(new TypeError("resource: Request | string | URL"));
    }

    fillParams(url.searchParams, options?.params);
    url = new URL(decodeURI(url.toString()));

    const request = {
      body: options?.body,
      cache: options?.cache || this._config.cache,
      credentials: options?.credentials || this._config.credentials,
      headers: this.headers(options?.headers),
      integrity: options?.integrity,
      keepalive: options?.keepalive,
      method: options?.method,
      mode: options?.mode || this._config.mode,
      redirect: options?.redirect,
      referrer: options?.referrer || this._config.referrer,
      referrerPolicy: options?.referrerPolicy || this._config.referrerPolicy,
      signal: options?.signal,
      ...options?.data,
    } as RequestInit;

    const fallbackOnRequestFulfilled = (request: Request) => request;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const fallbackOnRequestRejected = () => {};
    const requestInterceptorChain: Array<
      [(req: Request) => Promise<Request> | Request, (error: any) => void]
    > = [];
    this.interceptors.request.forEach((interceptor) =>
      requestInterceptorChain.unshift([
        interceptor.onfulfilled ?? fallbackOnRequestFulfilled,
        interceptor.onrejected ?? fallbackOnRequestRejected,
      ])
    );

    const fallbackOnResponseFulfilled = (response: Response) => response;
    const fallbackOnResponseRejected = (error: any) => error;
    const responseInterceptorChain: Array<
      [(res: Response) => Promise<Response> | Response, (error: any) => void]
    > = [];
    this.interceptors.response.forEach((interceptor) =>
      responseInterceptorChain.push([
        interceptor.onfulfilled ?? fallbackOnResponseFulfilled,
        interceptor.onrejected ?? fallbackOnResponseRejected,
      ])
    );

    return (async () => {
      // let resp: Promise<Response>;
      let resp: any;
      let req = new Request(url.toString(), request);

      for (let i = 0; i < requestInterceptorChain.length; i++) {
        const [onfulfilled, onrejected] = requestInterceptorChain[i];
        try {
          req = await onfulfilled(req);
        } catch (error) {
          onrejected(error);
          break;
        }
      }

      try {
        resp = this.dispatchRequest(req);
      } catch (error) {
        return Promise.reject(error);
      }

      for (let i = 0; i < responseInterceptorChain.length; i++) {
        const [onfulfilled, onrejected] = responseInterceptorChain[i];
        resp = resp.then(onfulfilled, onrejected);
      }

      return resp;
    })();
  }

  async jsonDo(
    resource: string | URL | Request,
    options?: RequestOptions
  ): Promise<any> {
    const allowedContentTypes = [
      "application/json",
      "text/json",
      "application/javascript",
      "application/vnd.api+json",
      "application/json; charset=utf-8",
    ];

    try {
      const response = await this.do(resource, options);
      const contentType = response.headers.get("Content-Type");

      if (
        response.ok &&
        contentType &&
        allowedContentTypes.includes(contentType)
      ) {
        return await response.json();
      }

      if (response.status === RESPONSE_STATUS.NO_CONTENT) {
        return {};
      }

      return Promise.reject({
        _type: "http-client-error",
        status: response.status,
        data:
          contentType && allowedContentTypes.includes(contentType)
            ? await response.json()
            : {},
      });
    } catch (error) {
      return Promise.reject({
        _type: "http-client-error",
        status: (error as any).status ?? 500,
        data: (error as any).message ?? {},
      });
    }
  }

  async blobDo(
    resource: string | URL | Request,
    options?: RequestOptions
  ): Promise<Blob> {
    try {
      const response = await this.do(resource, options);
      if (response.ok) {
        return await response.blob();
      }
      return Promise.reject(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async bufferDo(
    resource: string | URL | Request,
    options?: RequestOptions
  ): Promise<ArrayBuffer> {
    try {
      const response = await this.do(resource, options);
      if (response.ok) {
        return await response.arrayBuffer();
      }
      return Promise.reject(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private headers(optionsHeaders?: Record<string, string>): Headers {
    const headers = new Headers();
    copyHeaders(headers, this._config.headers);
    copyHeaders(headers, optionsHeaders);
    return headers;
  }
}
