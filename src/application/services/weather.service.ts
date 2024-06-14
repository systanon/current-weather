export class Weather {
  private httpClient;
  data:any = null
  isLocationEnabled: boolean = false
  constructor(httpClient: any) {
    this.httpClient = httpClient;
  }
  get locationEnabled () {
    return this.isLocationEnabled
  } 

  async getWeather(params: any) {
    const { url, apiKey, q, lang } = params;
    try {
      const weatherData = await this.httpClient.jsonDo(url, {
        params: {
          key: apiKey,
          q,
          lang,
        },
      });
      this.isLocationEnabled = true
      this.data = weatherData
      return weatherData
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }
}
