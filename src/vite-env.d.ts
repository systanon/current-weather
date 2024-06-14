/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_WEATHER_API_KEY: string;
  // Add more environment variables as needed.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
