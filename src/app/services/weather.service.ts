import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DataType, WeatherResponse } from '../models/whether.model';
import { WeatherColorsUtil } from '../utils/weather-colors.util';
import { WeatherResponseDTO, ForecastDayDTO, WeatherReportDTO } from '../models/weather-response.dto';
import { WeatherStationDTO } from '../models/wheatherStation.dto';

export interface WeatherDataInfo {
  value: number;
  color: string;
  unit: string;
  hasData: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_URL = 'https://data.buienradar.nl/2.0/feed/json';
  private selectedDataTypeSubject = new BehaviorSubject<DataType>(DataType.temperature);
  public selectedDataType$ = this.selectedDataTypeSubject.asObservable();
  

  private weatherDataDTO$: Observable<WeatherResponseDTO>;

  constructor(private http: HttpClient) {
    this.weatherDataDTO$ = this.http.get<WeatherResponse>(this.API_URL).pipe(
      map(response => new WeatherResponseDTO(response)),
      shareReplay(1) // Cache the result and replay to new subscribers
    );
  }

  refreshWeatherData(): void {
    this.weatherDataDTO$ = this.http.get<WeatherResponse>(this.API_URL).pipe(
      map(response => new WeatherResponseDTO(response)),
      shareReplay(1)
    );
  }

  getStations(): Observable<WeatherStationDTO[]> {
    return this.weatherDataDTO$.pipe(
      map(response => response.actual.stationmeasurements)
    );
  }


  getForecast(): Observable<ForecastDayDTO[]> {
    return this.weatherDataDTO$.pipe(
      map(response => response.forecast.fivedayforecast)
    );
  }


  getWeatherReport(): Observable<WeatherReportDTO> {
    return this.weatherDataDTO$.pipe(
      map(response => response.forecast.weatherreport)
    );
  }

  setSelectedDataType(dataType: DataType): void {
    this.selectedDataTypeSubject.next(dataType);
  }

  buildWeatherDataInfo(station: WeatherStationDTO, dataType: DataType): WeatherDataInfo {
    const hasData = this.hasDataForType(station, dataType);
    const unit = this.getUnitForDataType(dataType);

    let value, color = null;
    if (hasData) {
      value = this.getValueForDataType(station, dataType);
      color = WeatherColorsUtil.getColorForValue(value, dataType);
    } else {
        value = 0;
        color = WeatherColorsUtil.getColorForValue(0, dataType);
    }

    return {
      value,
      color,
      unit,
      hasData
    };
  }

  getValueForDataType(station: WeatherStationDTO, dataType: DataType): number {
    switch (dataType) {
      case DataType.temperature:
        return station.temperature ?? 0;
      case DataType.wind:
        return station.windspeed ?? 0;
      case DataType.windspeed:
        return station.windspeed ?? 0;
      case DataType.winddirection:
        return station.winddirectiondegrees ?? 0;
      case DataType.pressure:
        return station.airpressure ?? 0;
      default:
        return 0;
    }
  }

  hasDataForType(station: WeatherStationDTO, dataType: DataType): boolean {
    switch (dataType) {
      case DataType.temperature:
        return station.temperature !== undefined && station.temperature !== null;
      case DataType.wind:
        return (station.windspeed !== undefined && station.windspeed !== null) &&
               (station.winddirectiondegrees !== undefined && station.winddirectiondegrees !== null);
      case DataType.windspeed:
        return station.windspeed !== undefined && station.windspeed !== null;
      case DataType.winddirection:
        return station.winddirectiondegrees !== undefined && station.winddirectiondegrees !== null;
      case DataType.pressure:
        return station.airpressure !== undefined && station.airpressure !== null && station.airpressure > 0;
      default:
        return false;
    }
  }

  getUnitForDataType(dataType: DataType): string {
    switch (dataType) {
      case DataType.temperature:
        return '°C';
      case DataType.wind:
        return ' m/s';
      case DataType.windspeed:
        return ' m/s';
      case DataType.winddirection:
        return '°';
      case DataType.pressure:
        return ' hPa';
      default:
        return '';
    }
  }
}
