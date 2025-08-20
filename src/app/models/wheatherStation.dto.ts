import { WeatherStation } from "./whether.model";

export class WeatherStationDTO implements WeatherStation {
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
  parsedTimestamp: string;

  temperatureInfo: string;
  windInfo: string;

  constructor(weatherStation: WeatherStation) {
    this.stationid = weatherStation.stationid;
    this.stationname = weatherStation.stationname;
    this.lat = weatherStation.lat;
    this.lon = weatherStation.lon;
    this.regio = weatherStation.regio;
    this.timestamp = weatherStation.timestamp;
    this.weatherdescription = weatherStation.weatherdescription;
    this.iconurl = weatherStation.iconurl;
    this.fullIconUrl = weatherStation.fullIconUrl;
    this.winddirection = weatherStation.winddirection;
    this.winddirectiondegrees = weatherStation.winddirectiondegrees;
    this.airpressure = weatherStation.airpressure;
    this.temperature = weatherStation.temperature;
    this.groundtemperature = weatherStation.groundtemperature;
    this.feeltemperature = weatherStation.feeltemperature;
    this.visibility = weatherStation.visibility;
    this.windgusts = weatherStation.windgusts;
    this.windspeed = weatherStation.windspeed;
    this.windspeedBft = weatherStation.windspeedBft;
    this.humidity = weatherStation.humidity;
    this.precipitation = weatherStation.precipitation;
    this.sunpower = weatherStation.sunpower;
    this.rainFallLast24Hour = weatherStation.rainFallLast24Hour;
    this.rainFallLastHour = weatherStation.rainFallLastHour;

    this.parsedTimestamp = this.formatTimestamp(weatherStation.timestamp);
    this.temperatureInfo = this.formatTemperatureInfo(weatherStation.temperature, weatherStation.feeltemperature);
    this.windInfo = this.formatWindInfo(weatherStation.windspeed, weatherStation.winddirection, weatherStation.winddirectiondegrees);
  }
  
  private formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private formatTemperatureInfo(temperature: number, feeltemperature: number): string {
    return `${temperature}°C (feels like ${feeltemperature}°C)`;
  }

  private formatWindInfo(windspeed: number, winddirection: string, winddirectiondegrees: number): string {
    return `${windspeed} m/s ${winddirection} (${winddirectiondegrees}°)`;
  }
}