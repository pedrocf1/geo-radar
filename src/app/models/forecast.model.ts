import { WeatherReport } from "./whether.model";


export interface ForecastResponse {
    weatherreport: WeatherReport;
    shortterm: {
      startdate: string;
      enddate: string;
      forecast: string;
    };
    longterm: {
      startdate: string;
      enddate: string;
      forecast: string;
    };
    fivedayforecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  mintemperature: string;
  maxtemperature: string;
  mintemperatureMax: number;
  mintemperatureMin: number;
  maxtemperatureMax: number;
  maxtemperatureMin: number;
  rainChance: number;
  sunChance: number;
  windDirection: string;
  wind: number;
  mmRainMin: number;
  mmRainMax: number;
  weatherdescription: string;
  iconurl: string;
  fullIconUrl: string;
}

