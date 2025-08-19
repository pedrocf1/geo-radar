import { WeatherResponse, WeatherStation, WeatherReport } from '../models/whether.model';
import { ForecastDay } from '../models/forecast.model';
import { WeatherStationDTO } from './wheatherStation.dto';

export class ForecastDayDTO implements ForecastDay {
  day: string;
  mintemperature: string;
  maxtemperature: string;
  mintemperatureMin: number;
  mintemperatureMax: number;
  maxtemperatureMin: number;
  maxtemperatureMax: number;
  rainChance: number;
  sunChance: number;
  windDirection: string;
  wind: number;
  mmRainMin: number;
  mmRainMax: number;
  weatherdescription: string;
  iconurl: string;
  fullIconUrl: string;
  
  // Enhanced properties
  formattedDate: string;
  temperatureRange: string;
  rainForecast: string;
  windInfo: string;

  constructor(forecastDay: ForecastDay) {
    // Copy all original properties
    this.day = forecastDay.day;
    this.mintemperature = forecastDay.mintemperature;
    this.maxtemperature = forecastDay.maxtemperature;
    this.mintemperatureMin = forecastDay.mintemperatureMin;
    this.mintemperatureMax = forecastDay.mintemperatureMax;
    this.maxtemperatureMin = forecastDay.maxtemperatureMin;
    this.maxtemperatureMax = forecastDay.maxtemperatureMax;
    this.rainChance = forecastDay.rainChance;
    this.sunChance = forecastDay.sunChance;
    this.windDirection = forecastDay.windDirection;
    this.wind = forecastDay.wind;
    this.mmRainMin = forecastDay.mmRainMin;
    this.mmRainMax = forecastDay.mmRainMax;
    this.weatherdescription = forecastDay.weatherdescription;
    this.iconurl = forecastDay.iconurl;
    this.fullIconUrl = forecastDay.fullIconUrl;

    // Enhanced computed properties
    this.formattedDate = this.formatForecastDate(forecastDay.day);
    this.temperatureRange = `${forecastDay.mintemperature}° - ${forecastDay.maxtemperature}°`;
    this.rainForecast = this.formatRainForecast(forecastDay.rainChance, forecastDay.mmRainMin, forecastDay.mmRainMax);
    this.windInfo = `${forecastDay.wind} m/s ${forecastDay.windDirection}`;
  }

  private formatForecastDate(day: string): string {
    const date = new Date(day);
    return date.toLocaleDateString('en-NL', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  }

  private formatRainForecast(rainChance: number, mmMin: number, mmMax: number): string {
    if (rainChance === 0) return 'No rain expected';
    if (mmMin === mmMax) return `${rainChance}% chance, ${mmMin}mm`;
    return `${rainChance}% chance, ${mmMin}-${mmMax}mm`;
  }
}

export class WeatherReportDTO implements WeatherReport {
  published: string;
  title: string;
  summary: string;
  text: string;
  author: string;
  authorbio: string;
  
  // Enhanced properties
  formattedPublishDate: string;
  shortSummary: string;

  constructor(weatherReport: WeatherReport) {
    // Copy all original properties
    this.published = weatherReport.published;
    this.title = weatherReport.title;
    this.summary = weatherReport.summary;
    this.text = weatherReport.text;
    this.author = weatherReport.author;
    this.authorbio = weatherReport.authorbio;

    // Enhanced computed properties
    this.formattedPublishDate = this.formatPublishDate(weatherReport.published);
    this.shortSummary = this.createShortSummary(weatherReport.summary);
  }

  private formatPublishDate(published: string): string {
    const date = new Date(published);
    return date.toLocaleString('en-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private createShortSummary(summary: string): string {
    return summary.length > 150 ? summary.substring(0, 150) + '...' : summary;
  }
}

export class WeatherResponseDTO {
  actual: {
    actualradarurl: string;
    sunrise: string;
    sunset: string;
    stationmeasurements: WeatherStationDTO[];
  };
  forecast: {
    weatherreport: WeatherReportDTO;
    fivedayforecast: ForecastDayDTO[];
  };
  
  formattedSunrise: string;
  formattedSunset: string;
  dayLength: string;

  constructor(weatherResponse: WeatherResponse) {
    console.log('WeatherResponseDTO constructor called');
    const stationDTOs = weatherResponse.actual.stationmeasurements.map(
      station => new WeatherStationDTO(station)
    );

    const forecastDTOs = weatherResponse.forecast.fivedayforecast.map(
      day => new ForecastDayDTO(day)
    );

    this.actual = {
      actualradarurl: weatherResponse.actual.actualradarurl,
      sunrise: weatherResponse.actual.sunrise,
      sunset: weatherResponse.actual.sunset,
      stationmeasurements: stationDTOs
    };

    this.forecast = {
      weatherreport: new WeatherReportDTO(weatherResponse.forecast.weatherreport),
      fivedayforecast: forecastDTOs
    };

    this.formattedSunrise = this.formatTime(weatherResponse.actual.sunrise);
    this.formattedSunset = this.formatTime(weatherResponse.actual.sunset);
    this.dayLength = this.calculateDayLength(
      weatherResponse.actual.sunrise, 
      weatherResponse.actual.sunset
    );
  }

  private formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-NL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private calculateDayLength(sunrise: string, sunset: string): string {
    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);
    const diffMs = sunsetTime.getTime() - sunriseTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}
