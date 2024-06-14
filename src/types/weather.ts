export type WeatherData = {
  location: {
    localtime: Date;
    name: string;
    region: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    precip_mm: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_degree: number;
    wind_kph: number;
    wind_mph: number;
  };
};