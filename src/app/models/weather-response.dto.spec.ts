import { ForecastDayDTO, WeatherReportDTO, WeatherResponseDTO } from './weather-response.dto';
import { WeatherStationDTO } from './wheatherStation.dto';
import { ForecastDay } from './forecast.model';
import { WeatherReport, WeatherResponse, WeatherStation } from './whether.model';

describe('Weather Response DTOs', () => {

  describe('ForecastDayDTO', () => {
    let mockForecastDay: ForecastDay;

    beforeEach(() => {
      mockForecastDay = {
        day: '2025-08-21',
        mintemperature: '15',
        maxtemperature: '25',
        mintemperatureMin: 12,
        mintemperatureMax: 18,
        maxtemperatureMin: 22,
        maxtemperatureMax: 28,
        rainChance: 30,
        sunChance: 70,
        windDirection: 'NW',
        wind: 5,
        mmRainMin: 1,
        mmRainMax: 3,
        weatherdescription: 'Partly cloudy',
        iconurl: 'test-icon.png',
        fullIconUrl: 'https://example.com/test-icon.png'
      };
    });

    it('should create an instance', () => {
      const dto = new ForecastDayDTO(mockForecastDay);
      expect(dto).toBeTruthy();
    });

    it('should copy all properties from forecast day', () => {
      const dto = new ForecastDayDTO(mockForecastDay);
      
      expect(dto.day).toBe(mockForecastDay.day);
      expect(dto.mintemperature).toBe(mockForecastDay.mintemperature);
      expect(dto.maxtemperature).toBe(mockForecastDay.maxtemperature);
      expect(dto.rainChance).toBe(mockForecastDay.rainChance);
      expect(dto.sunChance).toBe(mockForecastDay.sunChance);
      expect(dto.windDirection).toBe(mockForecastDay.windDirection);
      expect(dto.wind).toBe(mockForecastDay.wind);
      expect(dto.weatherdescription).toBe(mockForecastDay.weatherdescription);
    });

    it('should format the date correctly', () => {
      const dto = new ForecastDayDTO(mockForecastDay);
      expect(dto.formattedDate).toBeDefined();
      expect(typeof dto.formattedDate).toBe('string');
    });

    it('should create temperature range string', () => {
      const dto = new ForecastDayDTO(mockForecastDay);
      expect(dto.temperatureRange).toBe('15° - 25°');
    });

    it('should format wind info', () => {
      const dto = new ForecastDayDTO(mockForecastDay);
      expect(dto.windInfo).toBe('5 m/s NW');
    });

    it('should format rain forecast with range', () => {
      const dto = new ForecastDayDTO(mockForecastDay);
      expect(dto.rainForecast).toBe('30% chance, 1-3mm');
    });

    it('should format rain forecast with equal min/max', () => {
      mockForecastDay.mmRainMin = 2;
      mockForecastDay.mmRainMax = 2;
      const dto = new ForecastDayDTO(mockForecastDay);
      expect(dto.rainForecast).toBe('30% chance, 2mm');
    });

    it('should format rain forecast for no rain', () => {
      mockForecastDay.rainChance = 0;
      const dto = new ForecastDayDTO(mockForecastDay);
      expect(dto.rainForecast).toBe('No rain expected');
    });
  });

  describe('WeatherReportDTO', () => {
    let mockWeatherReport: WeatherReport;

    beforeEach(() => {
      mockWeatherReport = {
        published: '2025-08-20T10:30:00.000Z',
        title: 'Weather Update',
        summary: 'Today will be partly cloudy with temperatures reaching 25°C. There is a 30% chance of rain in the afternoon.',
        text: 'Detailed weather forecast text here...',
        author: 'Weather Service',
        authorbio: 'Professional meteorologist'
      };
    });

    it('should create an instance', () => {
      const dto = new WeatherReportDTO(mockWeatherReport);
      expect(dto).toBeTruthy();
    });

    it('should copy all properties from weather report', () => {
      const dto = new WeatherReportDTO(mockWeatherReport);
      
      expect(dto.published).toBe(mockWeatherReport.published);
      expect(dto.title).toBe(mockWeatherReport.title);
      expect(dto.summary).toBe(mockWeatherReport.summary);
      expect(dto.text).toBe(mockWeatherReport.text);
      expect(dto.author).toBe(mockWeatherReport.author);
      expect(dto.authorbio).toBe(mockWeatherReport.authorbio);
    });

    it('should format publish date', () => {
      const dto = new WeatherReportDTO(mockWeatherReport);
      expect(dto.formattedPublishDate).toBeDefined();
      expect(typeof dto.formattedPublishDate).toBe('string');
    });

    it('should create short summary for long text', () => {
      const longSummary = 'A'.repeat(200);
      mockWeatherReport.summary = longSummary;
      const dto = new WeatherReportDTO(mockWeatherReport);
      
      expect(dto.shortSummary).toBe(longSummary.substring(0, 150) + '...');
      expect(dto.shortSummary.length).toBe(153);
    });

    it('should keep short summary unchanged for short text', () => {
      const shortSummary = 'Short weather summary';
      mockWeatherReport.summary = shortSummary;
      const dto = new WeatherReportDTO(mockWeatherReport);
      
      expect(dto.shortSummary).toBe(shortSummary);
    });

    it('should handle exactly 150 character summary', () => {
      const exactSummary = 'A'.repeat(150);
      mockWeatherReport.summary = exactSummary;
      const dto = new WeatherReportDTO(mockWeatherReport);
      
      expect(dto.shortSummary).toBe(exactSummary);
    });
  });

  describe('WeatherResponseDTO', () => {
    let mockWeatherResponse: WeatherResponse;
    let mockWeatherStation: WeatherStation;
    let mockForecastDay: ForecastDay;
    let mockWeatherReport: WeatherReport;

    beforeEach(() => {
      mockWeatherStation = {
        stationid: 1,
        stationname: 'Test Station',
        lat: 52.3676,
        lon: 4.9041,
        regio: 'Amsterdam',
        timestamp: '2025-08-20T12:00:00.000Z',
        weatherdescription: 'Sunny',
        iconurl: 'sunny.png',
        fullIconUrl: 'https://example.com/sunny.png',
        winddirection: 'N',
        winddirectiondegrees: 0,
        airpressure: 1013,
        temperature: 20,
        groundtemperature: 18,
        feeltemperature: 22,
        visibility: 10000,
        windgusts: 8,
        windspeed: 5,
        windspeedBft: 3,
        humidity: 60,
        precipitation: 0,
        sunpower: 800,
        rainFallLast24Hour: 0,
        rainFallLastHour: 0
      };

      mockForecastDay = {
        day: '2025-08-21',
        mintemperature: '15',
        maxtemperature: '25',
        mintemperatureMin: 12,
        mintemperatureMax: 18,
        maxtemperatureMin: 22,
        maxtemperatureMax: 28,
        rainChance: 30,
        sunChance: 70,
        windDirection: 'NW',
        wind: 5,
        mmRainMin: 1,
        mmRainMax: 3,
        weatherdescription: 'Partly cloudy',
        iconurl: 'test-icon.png',
        fullIconUrl: 'https://example.com/test-icon.png'
      };

      mockWeatherReport = {
        published: '2025-08-20T10:30:00.000Z',
        title: 'Weather Update',
        summary: 'Today will be partly cloudy',
        text: 'Detailed weather forecast text here...',
        author: 'Weather Service',
        authorbio: 'Professional meteorologist'
      };

      mockWeatherResponse = {
        actual: {
          actualradarurl: 'https://example.com/radar.gif',
          sunrise: '2025-08-20T06:30:00.000Z',
          sunset: '2025-08-20T20:15:00.000Z',
          stationmeasurements: [mockWeatherStation]
        },
        forecast: {
          weatherreport: mockWeatherReport,
          shortterm: {
            startdate: '2025-08-20',
            enddate: '2025-08-22',
            forecast: 'Short term forecast'
          },
          longterm: {
            startdate: '2025-08-20',
            enddate: '2025-08-27',
            forecast: 'Long term forecast'
          },
          fivedayforecast: [mockForecastDay]
        }
      };
    });

    it('should create an instance', () => {
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto).toBeTruthy();
    });

    it('should copy actual data correctly', () => {
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      
      expect(dto.actual.actualradarurl).toBe(mockWeatherResponse.actual.actualradarurl);
      expect(dto.actual.sunrise).toBe(mockWeatherResponse.actual.sunrise);
      expect(dto.actual.sunset).toBe(mockWeatherResponse.actual.sunset);
      expect(dto.actual.stationmeasurements.length).toBe(1);
      expect(dto.actual.stationmeasurements[0]).toBeInstanceOf(WeatherStationDTO);
    });

    it('should copy forecast data correctly', () => {
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      
      expect(dto.forecast.weatherreport).toBeInstanceOf(WeatherReportDTO);
      expect(dto.forecast.fivedayforecast.length).toBe(1);
      expect(dto.forecast.fivedayforecast[0]).toBeInstanceOf(ForecastDayDTO);
    });

    it('should format sunrise time', () => {
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.formattedSunrise).toBeDefined();
      expect(typeof dto.formattedSunrise).toBe('string');
    });

    it('should format sunset time', () => {
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.formattedSunset).toBeDefined();
      expect(typeof dto.formattedSunset).toBe('string');
    });

    it('should calculate day length correctly', () => {
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.dayLength).toBeDefined();
      expect(typeof dto.dayLength).toBe('string');
      expect(dto.dayLength).toMatch(/^\d+h \d+m$/);
    });

    it('should log constructor call', () => {
      spyOn(console, 'log');
      new WeatherResponseDTO(mockWeatherResponse);
      expect(console.log).toHaveBeenCalledWith('WeatherResponseDTO constructor called');
    });

    it('should handle multiple weather stations', () => {
      const secondStation = { ...mockWeatherStation, stationid: 2, stationname: 'Second Station' };
      mockWeatherResponse.actual.stationmeasurements.push(secondStation);
      
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.actual.stationmeasurements.length).toBe(2);
      expect(dto.actual.stationmeasurements[1].stationid).toBe(2);
    });

    it('should handle multiple forecast days', () => {
      const secondDay = { ...mockForecastDay, day: '2025-08-22' };
      mockWeatherResponse.forecast.fivedayforecast.push(secondDay);
      
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.forecast.fivedayforecast.length).toBe(2);
      expect(dto.forecast.fivedayforecast[1].day).toBe('2025-08-22');
    });

    it('should handle empty station measurements array', () => {
      mockWeatherResponse.actual.stationmeasurements = [];
      
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.actual.stationmeasurements.length).toBe(0);
    });

    it('should handle empty forecast array', () => {
      mockWeatherResponse.forecast.fivedayforecast = [];
      
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.forecast.fivedayforecast.length).toBe(0);
    });

    it('should calculate day length for same day sunrise/sunset', () => {
      mockWeatherResponse.actual.sunrise = '2025-08-20T06:30:00.000Z';
      mockWeatherResponse.actual.sunset = '2025-08-20T06:30:00.000Z';
      
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.dayLength).toBe('0h 0m');
    });

    it('should calculate day length for different times', () => {
      mockWeatherResponse.actual.sunrise = '2025-08-20T06:00:00.000Z';
      mockWeatherResponse.actual.sunset = '2025-08-20T18:30:00.000Z';
      
      const dto = new WeatherResponseDTO(mockWeatherResponse);
      expect(dto.dayLength).toBe('12h 30m');
    });
  });
});
