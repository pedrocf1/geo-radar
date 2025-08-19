import { ForecastResponse } from "./forecast.model";

export interface WeatherStation {
  stationid: number;
  stationname: string;
  lat: number;
  lon: number;
  regio: string;
  timestamp: string;
  weatherdescription: string;
  iconurl: string;
  fullIconUrl: string;
  winddirection: string;
  winddirectiondegrees: number;
  airpressure?: number;
  temperature: number;
  groundtemperature: number;
  feeltemperature: number;
  visibility?: number;
  windgusts: number;
  windspeed: number;
  windspeedBft: number;
  humidity: number;
  precipitation: number;
  sunpower: number;
  rainFallLast24Hour: number;
  rainFallLastHour: number;
}

export interface WeatherResponse {
  actual: {
    actualradarurl: string;
    sunrise: string;
    sunset: string;
    stationmeasurements: WeatherStation[];
  };
  forecast: ForecastResponse;
}

export interface WeatherReport {
  published: string;
  title: string;
  summary: string;
  text: string;
  author: string;
  authorbio: string;
}

export enum DataType {
  temperature = 'temperature',
  wind = 'wind',
  windspeed = 'windspeed',
  winddirection = 'winddirection',
  pressure = 'pressure',
}

export type WeatherColor = {
  color: string;
  label: string;
}