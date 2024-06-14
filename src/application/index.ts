import { HTTPClient } from "../libs/httpClient";
import { Weather } from "./services/weather.service";

const weatherApiBaseUrl = import.meta.env.VITE_APP_API_URL;


const httpClient = new HTTPClient({
  base: weatherApiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});


export const weather = new Weather(httpClient);