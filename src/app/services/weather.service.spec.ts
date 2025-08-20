import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WeatherService } from './weather.service';
import { DataType, WeatherResponse } from '../models/whether.model';
import { WeatherStationDTO } from '../models/wheatherStation.dto';
import { WeatherColorsUtil } from '../utils/weather-colors.util';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const mockWeatherResponse: WeatherResponse = {
    actual: {
      actualradarurl: 'test-url',
      sunrise: '06:00',
      sunset: '18:00',
      stationmeasurements: [
        {
          stationid: 1,
          stationname: 'Test Station',
          lat: 52.1,
          lon: 5.2,
          regio: 'Test Region',
          timestamp: '2023-01-01T12:00:00',
          weatherdescription: 'Sunny',
          iconurl: 'icon.png',
          fullIconUrl: 'full-icon.png',
          winddirection: 'NW',
          winddirectiondegrees: 315,
          airpressure: 1013,
          temperature: 15,
          groundtemperature: 10,
          feeltemperature: 16,
          visibility: 10,
          windgusts: 20,
          windspeed: 10,
          windspeedBft: 3,
          humidity: 60,
          precipitation: 0,
          sunpower: 500,
          rainFallLast24Hour: 0,
          rainFallLastHour: 0
        }
      ]
    },
    forecast: {
      weatherreport: {
        published: '2023-01-01T08:00:00',
        title: 'Weather Report',
        summary: 'Test summary',
        text: 'Test weather report text',
        author: 'Test Author',
        authorbio: 'Test bio'
      },
      shortterm: {
        startdate: '2023-01-01',
        enddate: '2023-01-02',
        forecast: 'Short term forecast'
      },
      longterm: {
        startdate: '2023-01-01',
        enddate: '2023-01-07',
        forecast: 'Long term forecast'
      },
      fivedayforecast: [
        {
          day: '2023-01-01',
          mintemperature: '5',
          maxtemperature: '15',
          mintemperatureMax: 5,
          mintemperatureMin: 3,
          maxtemperatureMax: 17,
          maxtemperatureMin: 13,
          rainChance: 20,
          sunChance: 80,
          windDirection: 'NW',
          wind: 3,
          mmRainMin: 0,
          mmRainMax: 2,
          weatherdescription: 'Partly cloudy',
          iconurl: 'day-icon.png',
          fullIconUrl: 'day-full-icon.png'
        }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStations', () => {
    it('should return weather stations', () => {
      service.getStations().subscribe(stations => {
        expect(stations).toBeDefined();
        expect(stations.length).toBe(1);
        expect(stations[0].stationname).toBe('Test Station');
        expect(stations[0].temperature).toBe(15);
        expect(stations[0].windspeed).toBe(10);
      });

      const req = httpMock.expectOne('https://data.buienradar.nl/2.0/feed/json');
      expect(req.request.method).toBe('GET');
      req.flush(mockWeatherResponse);
    });
  });

  describe('getForecast', () => {
    it('should return forecast data', () => {
      service.getForecast().subscribe(forecast => {
        expect(forecast).toBeDefined();
        expect(forecast.length).toBe(1);
        expect(forecast[0].day).toBe('2023-01-01');
        expect(forecast[0].weatherdescription).toBe('Partly cloudy');
        expect(forecast[0].mintemperature).toBe('5');
        expect(forecast[0].maxtemperature).toBe('15');
      });

      const req = httpMock.expectOne('https://data.buienradar.nl/2.0/feed/json');
      expect(req.request.method).toBe('GET');
      req.flush(mockWeatherResponse);
    });
  });

  describe('getWeatherReport', () => {
    it('should return weather report', () => {
      service.getWeatherReport().subscribe(report => {
        expect(report).toBeDefined();
        expect(report.title).toBe('Weather Report');
        expect(report.summary).toBe('Test summary');
        expect(report.author).toBe('Test Author');
        expect(report.published).toBe('2023-01-01T08:00:00');
      });

      const req = httpMock.expectOne('https://data.buienradar.nl/2.0/feed/json');
      expect(req.request.method).toBe('GET');
      req.flush(mockWeatherResponse);
    });
  });

  describe('refreshWeatherData', () => {
    it('should refresh weather data and make new HTTP request', () => {
      // First call to initialize the service
      service.getStations().subscribe();
      const firstReq = httpMock.expectOne('https://data.buienradar.nl/2.0/feed/json');
      firstReq.flush(mockWeatherResponse);

      // Refresh data
      service.refreshWeatherData();

      // Second call after refresh
      service.getStations().subscribe();
      const secondReq = httpMock.expectOne('https://data.buienradar.nl/2.0/feed/json');
      expect(secondReq.request.method).toBe('GET');
      secondReq.flush(mockWeatherResponse);
    });
  });

  describe('selectedDataType$', () => {
    it('should have default selected data type as temperature', () => {
      service.selectedDataType$.subscribe(dataType => {
        expect(dataType).toBe(DataType.temperature);
      });
    });

    it('should update selected data type', () => {
      service.setSelectedDataType(DataType.wind);
      
      service.selectedDataType$.subscribe(dataType => {
        expect(dataType).toBe(DataType.wind);
      });
    });
  });

  describe('buildWeatherDataInfo', () => {
    let mockStation: WeatherStationDTO;

    beforeEach(() => {
      const mockWeatherStation = {
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: 15,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      };
      mockStation = new WeatherStationDTO(mockWeatherStation);
    });

    it('should build weather data info for temperature', () => {
      spyOn(WeatherColorsUtil, 'getColorForValue').and.returnValue('#ff0000');
      
      const result = service.buildWeatherDataInfo(mockStation, DataType.temperature);
      
      expect(result.value).toBe(15);
      expect(result.unit).toBe('°C');
      expect(result.hasData).toBe(true);
      expect(result.color).toBe('#ff0000');
    });

    it('should build weather data info for wind speed', () => {
      spyOn(WeatherColorsUtil, 'getColorForValue').and.returnValue('#00ff00');
      
      const result = service.buildWeatherDataInfo(mockStation, DataType.windspeed);
      
      expect(result.value).toBe(10);
      expect(result.unit).toBe(' m/s');
      expect(result.hasData).toBe(true);
      expect(result.color).toBe('#00ff00');
    });

    it('should build weather data info for pressure', () => {
      spyOn(WeatherColorsUtil, 'getColorForValue').and.returnValue('#0000ff');
      
      const result = service.buildWeatherDataInfo(mockStation, DataType.pressure);
      
      expect(result.value).toBe(1013);
      expect(result.unit).toBe(' hPa');
      expect(result.hasData).toBe(true);
      expect(result.color).toBe('#0000ff');
    });

    it('should handle missing data gracefully', () => {
      const stationWithoutTemp = new WeatherStationDTO({
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: undefined as any,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      });
      spyOn(WeatherColorsUtil, 'getColorForValue').and.returnValue('#cccccc');
      
      const result = service.buildWeatherDataInfo(stationWithoutTemp, DataType.temperature);
      
      expect(result.value).toBe(0);
      expect(result.unit).toBe('°C');
      expect(result.hasData).toBe(false);
      expect(result.color).toBe('#cccccc');
    });
  });

  describe('getValueForDataType', () => {
    let mockStation: WeatherStationDTO;

    beforeEach(() => {
      const mockWeatherStation = {
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: 15,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      };
      mockStation = new WeatherStationDTO(mockWeatherStation);
    });

    it('should return temperature value', () => {
      const result = service.getValueForDataType(mockStation, DataType.temperature);
      expect(result).toBe(15);
    });

    it('should return wind speed value', () => {
      const result = service.getValueForDataType(mockStation, DataType.windspeed);
      expect(result).toBe(10);
    });

    it('should return wind direction value', () => {
      const result = service.getValueForDataType(mockStation, DataType.winddirection);
      expect(result).toBe(315);
    });

    it('should return pressure value', () => {
      const result = service.getValueForDataType(mockStation, DataType.pressure);
      expect(result).toBe(1013);
    });

    it('should return 0 for unknown data type', () => {
      const result = service.getValueForDataType(mockStation, 'unknown' as DataType);
      expect(result).toBe(0);
    });

    it('should return 0 for null values', () => {
      const stationWithNulls = new WeatherStationDTO({
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: null as any,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      });
      const result = service.getValueForDataType(stationWithNulls, DataType.temperature);
      expect(result).toBe(0);
    });
  });

  describe('hasDataForType', () => {
    let mockStation: WeatherStationDTO;

    beforeEach(() => {
      const mockWeatherStation = {
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: 15,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      };
      mockStation = new WeatherStationDTO(mockWeatherStation);
    });

    it('should return true when temperature data exists', () => {
      const result = service.hasDataForType(mockStation, DataType.temperature);
      expect(result).toBe(true);
    });

    it('should return false when temperature data is null', () => {
      const stationWithoutTemp = new WeatherStationDTO({
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: null as any,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      });
      const result = service.hasDataForType(stationWithoutTemp, DataType.temperature);
      expect(result).toBe(false);
    });

    it('should return false when temperature data is undefined', () => {
      const stationWithoutTemp = new WeatherStationDTO({
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: undefined as any,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      });
      const result = service.hasDataForType(stationWithoutTemp, DataType.temperature);
      expect(result).toBe(false);
    });

    it('should return true when wind data exists (both speed and direction)', () => {
      const result = service.hasDataForType(mockStation, DataType.wind);
      expect(result).toBe(true);
    });

    it('should return false when wind speed is missing', () => {
      const stationWithoutWindSpeed = new WeatherStationDTO({
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 1013,
        temperature: 15,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: null as any,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      });
      const result = service.hasDataForType(stationWithoutWindSpeed, DataType.wind);
      expect(result).toBe(false);
    });

    it('should return false when wind direction is missing', () => {
      const stationWithoutWindDir = new WeatherStationDTO({
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: null as any,
        airpressure: 1013,
        temperature: 15,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      });
      const result = service.hasDataForType(stationWithoutWindDir, DataType.wind);
      expect(result).toBe(false);
    });

    it('should return true when pressure data exists and is greater than 0', () => {
      const result = service.hasDataForType(mockStation, DataType.pressure);
      expect(result).toBe(true);
    });

    it('should return false when pressure is 0', () => {
      const stationWithZeroPressure = new WeatherStationDTO({
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.1,
        lon: 5.2,
        regio: 'Test Region',
        timestamp: '2023-01-01T12:00:00',
        weatherdescription: 'Sunny',
        iconurl: 'icon.png',
        fullIconUrl: 'full-icon.png',
        winddirection: 'NW',
        winddirectiondegrees: 315,
        airpressure: 0,
        temperature: 15,
        groundtemperature: 10,
        feeltemperature: 16,
        visibility: 10,
        windgusts: 20,
        windspeed: 10,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 500,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      });
      const result = service.hasDataForType(stationWithZeroPressure, DataType.pressure);
      expect(result).toBe(false);
    });

    it('should return false for unknown data type', () => {
      const result = service.hasDataForType(mockStation, 'unknown' as DataType);
      expect(result).toBe(false);
    });
  });

  describe('getUnitForDataType', () => {
    it('should return correct unit for temperature', () => {
      const result = service.getUnitForDataType(DataType.temperature);
      expect(result).toBe('°C');
    });

    it('should return correct unit for wind speed', () => {
      const result = service.getUnitForDataType(DataType.windspeed);
      expect(result).toBe(' m/s');
    });

    it('should return correct unit for wind', () => {
      const result = service.getUnitForDataType(DataType.wind);
      expect(result).toBe(' m/s');
    });

    it('should return correct unit for wind direction', () => {
      const result = service.getUnitForDataType(DataType.winddirection);
      expect(result).toBe('°');
    });

    it('should return correct unit for pressure', () => {
      const result = service.getUnitForDataType(DataType.pressure);
      expect(result).toBe(' hPa');
    });

    it('should return empty string for unknown data type', () => {
      const result = service.getUnitForDataType('unknown' as DataType);
      expect(result).toBe('');
    });
  });

});
