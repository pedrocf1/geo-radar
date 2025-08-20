import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ForecastComponent } from './forecast.component';
import { WeatherService } from '../../services/weather.service';
import { ForecastDayDTO, WeatherReportDTO } from '../../models/weather-response.dto';
import { of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;
  let weatherService: jasmine.SpyObj<WeatherService>;

  const mockForecastDay = new ForecastDayDTO({
    day: '2024-01-01',
    mintemperature: '5',
    maxtemperature: '15',
    mintemperatureMin: 3,
    mintemperatureMax: 7,
    maxtemperatureMin: 13,
    maxtemperatureMax: 17,
    rainChance: 20,
    sunChance: 80,
    windDirection: 'NW',
    wind: 3,
    mmRainMin: 0,
    mmRainMax: 2,
    weatherdescription: 'Partly cloudy',
    iconurl: 'test.png',
    fullIconUrl: 'test-full.png'
  });

  const mockWeatherReport = new WeatherReportDTO({
    published: '2024-01-01T12:00:00Z',
    title: 'Weather Report',
    summary: 'Today will be partly cloudy with occasional sunshine.',
    text: 'Today will be partly cloudy. Temperatures will reach up to 15 degrees. Tomorrow expect rain showers.',
    author: 'Weather Expert',
    authorbio: 'Professional meteorologist'
  });

  beforeEach(async () => {
    const weatherServiceSpy = jasmine.createSpyObj('WeatherService', [
      'getForecast',
      'getWeatherReport'
    ]);

    await TestBed.configureTestingModule({
      imports: [ForecastComponent],
      providers: [
        HttpClient,
        { provide: WeatherService, useValue: weatherServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;

    weatherService.getForecast.and.returnValue(of([mockForecastDay]));
    weatherService.getWeatherReport.and.returnValue(of(mockWeatherReport));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with empty forecast and null weather report', () => {
      expect(component.forecast).toEqual([]);
      expect(component.weatherReport).toBeNull();
    });

    it('should load forecast data on init', () => {
      component.ngOnInit();

      expect(weatherService.getForecast).toHaveBeenCalled();
      expect(weatherService.getWeatherReport).toHaveBeenCalled();
      expect(component.forecast).toEqual([mockForecastDay]);
      expect(component.weatherReport).toBe(mockWeatherReport);
    });

    it('should setup destroy subject', () => {
      expect(component['destroy$']).toBeDefined();
      expect(component['destroy$']).toBeInstanceOf(Subject);
    });
  });

  describe('Component Lifecycle', () => {
    it('should call loadForecastData on ngOnInit', () => {
      spyOn(component as any, 'loadForecastData');
      
      component.ngOnInit();
      
      expect((component as any).loadForecastData).toHaveBeenCalled();
    });

    it('should cleanup on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should unsubscribe from observables on destroy', () => {
      const nextSpy = spyOn(component['destroy$'], 'next');
      
      component.ngOnInit();
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should load forecast data from service', () => {
      component['loadForecastData']();
      
      expect(weatherService.getForecast).toHaveBeenCalled();
      expect(component.forecast).toEqual([mockForecastDay]);
    });

    it('should load weather report from service', () => {
      component['loadForecastData']();
      
      expect(weatherService.getWeatherReport).toHaveBeenCalled();
      expect(component.weatherReport).toBe(mockWeatherReport);
    });

    it('should handle empty forecast data', () => {
      weatherService.getForecast.and.returnValue(of([]));
      
      component['loadForecastData']();
      
      expect(component.forecast).toEqual([]);
    });

    it('should handle null weather report', () => {
      weatherService.getWeatherReport.and.returnValue(of(null as any));
      
      component['loadForecastData']();
      
      expect(component.weatherReport).toBeNull();
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.forecast = [mockForecastDay];
      component.weatherReport = mockWeatherReport;
      fixture.detectChanges();
    });

    it('should render today weather section when weather report exists', () => {
      const todayWeather = fixture.debugElement.query(By.css('.today-weather'));
      expect(todayWeather).toBeTruthy();
      
      const title = fixture.debugElement.query(By.css('.today-weather h3'));
      expect(title.nativeElement.textContent).toBe(mockWeatherReport.title);
    });

    it('should not render today weather section when weather report is null', () => {
      component.weatherReport = null;
      fixture.detectChanges();
      
      const todayWeather = fixture.debugElement.query(By.css('.today-weather'));
      expect(todayWeather).toBeFalsy();
    });

    it('should render forecast cards', () => {
      const forecastCards = fixture.debugElement.queryAll(By.css('.forecast-card'));
      expect(forecastCards.length).toBe(1);
    });

    it('should render forecast day information', () => {
      const weatherDesc = fixture.debugElement.query(By.css('.weather-desc'));
      expect(weatherDesc.nativeElement.textContent).toBe(mockForecastDay.weatherdescription);
    });

    it('should render temperature range', () => {
      const tempMax = fixture.debugElement.query(By.css('.temp-max'));
      const tempMin = fixture.debugElement.query(By.css('.temp-min'));
      
      expect(tempMax.nativeElement.textContent).toBe('15°');
      expect(tempMin.nativeElement.textContent).toBe('5°');
    });

    it('should render weather details', () => {
      const detailItems = fixture.debugElement.queryAll(By.css('.detail-item'));
      expect(detailItems.length).toBeGreaterThan(0);
    });

    it('should render detailed forecast when weather report exists', () => {
      const detailedForecast = fixture.debugElement.query(By.css('.detailed-forecast'));
      expect(detailedForecast).toBeTruthy();
    });

    it('should not render detailed forecast when weather report is null', () => {
      component.weatherReport = null;
      fixture.detectChanges();
      
      const detailedForecast = fixture.debugElement.query(By.css('.detailed-forecast'));
      expect(detailedForecast).toBeFalsy();
    });

    it('should apply today class to first forecast card', () => {
      const firstCard = fixture.debugElement.query(By.css('.forecast-card'));
      expect(firstCard.nativeElement.classList).toContain('today');
    });

    it('should render weather icon', () => {
      const weatherIcon = fixture.debugElement.query(By.css('.weather-icon'));
      expect(weatherIcon.nativeElement.src).toContain(mockForecastDay.fullIconUrl);
      expect(weatherIcon.nativeElement.alt).toBe(mockForecastDay.weatherdescription);
    });

    it('should render rain details when mmRainMax > 0', () => {
      const rainDetails = fixture.debugElement.query(By.css('.detail-item:nth-child(4)'));
      expect(rainDetails.nativeElement.textContent.trim()).toContain('0-2mm');
    });

    it('should not render rain details when mmRainMax is 0', () => {
      component.forecast[0].mmRainMax = 0;
      fixture.detectChanges();
      
      const detailItems = fixture.debugElement.queryAll(By.css('.detail-item'));
      const rainDetail = detailItems.find(item => 
        item.nativeElement.textContent.includes('mm')
      );
      expect(rainDetail).toBeFalsy();
    });
  });

  describe('formatForecastDay Method', () => {
    it('should return "Today" when isToday is true', () => {
      const result = component.formatForecastDay('2024-01-01', true);
      expect(result).toBe('Today');
    });

    it('should return "Tomorrow" for tomorrow date', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2024-01-01T12:00:00Z'));
      
      const result = component.formatForecastDay('2024-01-02', false);
      expect(result).toBe('Monday');
      
      jasmine.clock().uninstall();
    });

    it('should return weekday for other dates', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2024-01-01T12:00:00Z'));
      
      const result = component.formatForecastDay('2024-01-04', false);
      const expectedDate = new Date('2024-01-04');
      const expectedWeekday = expectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      expect(result).toBe(expectedWeekday);
      
      jasmine.clock().uninstall();
    });

    it('should handle invalid date strings gracefully', () => {
      const result = component.formatForecastDay('invalid-date', false);
      expect(result).toBe('Invalid Date');
    });

    it('should prioritize isToday parameter over date logic', () => {
      const result = component.formatForecastDay('2024-01-02', true);
      expect(result).toBe('Today');
    });
  });

  describe('formatForecastText Method', () => {
    it('should replace &nbsp; with spaces', () => {
      const input = 'Test&nbsp;text&nbsp;here';
      const result = component.formatForecastText(input);
      expect(result).toContain('Test text here');
    });

    it('should wrap sentences in paragraph tags', () => {
      const input = 'First sentence. Second sentence';
      const result = component.formatForecastText(input);
      expect(result).toContain('<p>First sentence.</p><p>Second sentence</p>');
    });

    it('should handle exclamation marks', () => {
      const input = 'Great weather! Enjoy outside';
      const result = component.formatForecastText(input);
      expect(result).toContain('<p>Great weather!</p><p>Enjoy outside</p>');
    });

    it('should handle question marks', () => {
      const input = 'Will it rain? Probably not';
      const result = component.formatForecastText(input);
      expect(result).toContain('<p>Will it rain?</p><p>Probably not</p>');
    });

    it('should wrap entire text in paragraph tags', () => {
      const input = 'Simple text';
      const result = component.formatForecastText(input);
      expect(result).toBe('<p>Simple text</p>');
    });

    it('should handle empty text', () => {
      const result = component.formatForecastText('');
      expect(result).toBe('<p></p>');
    });

    it('should handle multiple sentences correctly', () => {
      const input = 'Today is sunny. Tomorrow will rain! What about next week?';
      const result = component.formatForecastText(input);
      expect(result).toContain('<p>Today is sunny.</p><p>Tomorrow will rain!</p><p>What about next week?</p>');
    });

    it('should handle text without sentence endings', () => {
      const input = 'Just some text without endings';
      const result = component.formatForecastText(input);
      expect(result).toBe('<p>Just some text without endings</p>');
    });
  });

  describe('Data Subscription Management', () => {
    it('should use takeUntil operator for forecast subscription', () => {
      spyOn(component['destroy$'], 'asObservable').and.callThrough();
      
      component['loadForecastData']();
      
      expect(weatherService.getForecast).toHaveBeenCalled();
    });

    it('should use takeUntil operator for weather report subscription', () => {
      spyOn(component['destroy$'], 'asObservable').and.callThrough();
      
      component['loadForecastData']();
      
      expect(weatherService.getWeatherReport).toHaveBeenCalled();
    });

    it('should handle service errors gracefully', () => {
      weatherService.getForecast.and.returnValue(of([]));
      weatherService.getWeatherReport.and.returnValue(of(null as any));
      
      expect(() => component['loadForecastData']()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple forecast days', () => {
      const secondDay = new ForecastDayDTO({
        ...mockForecastDay,
        day: '2024-01-02'
      });
      const multipleDays = [mockForecastDay, secondDay];
      weatherService.getForecast.and.returnValue(of(multipleDays));
      
      component['loadForecastData']();
      
      expect(component.forecast.length).toBe(2);
    });

    it('should handle weather report without title', () => {
      const reportWithoutTitle = new WeatherReportDTO({
        published: '2024-01-01T12:00:00Z',
        title: '',
        summary: 'Today will be partly cloudy with occasional sunshine.',
        text: 'Today will be partly cloudy. Temperatures will reach up to 15 degrees. Tomorrow expect rain showers.',
        author: 'Weather Expert',
        authorbio: 'Professional meteorologist'
      });
      
      weatherService.getWeatherReport.and.returnValue(of(reportWithoutTitle));
      component['loadForecastData']();
      fixture.detectChanges();
      
      const title = fixture.debugElement.query(By.css('.today-weather h3'));
      expect(title.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle weather report without text', () => {
      const reportWithoutText = new WeatherReportDTO({
        published: '2024-01-01T12:00:00Z',
        title: 'Weather Report',
        summary: 'Today will be partly cloudy with occasional sunshine.',
        text: '',
        author: 'Weather Expert',
        authorbio: 'Professional meteorologist'
      });
      
      weatherService.getWeatherReport.and.returnValue(of(reportWithoutText));
      component['loadForecastData']();
      fixture.detectChanges();
      
      const forecastText = fixture.debugElement.query(By.css('.forecast-text'));
      expect(forecastText.nativeElement.innerHTML).toBe('<p></p>');
    });
  });

  describe('Component Integration', () => {
    it('should update view when forecast data changes', () => {
      weatherService.getForecast.and.returnValue(of([]));
      component['loadForecastData']();
      fixture.detectChanges();
      
      let forecastCards = fixture.debugElement.queryAll(By.css('.forecast-card'));
      expect(forecastCards.length).toBe(0);
      
      weatherService.getForecast.and.returnValue(of([mockForecastDay]));
      component['loadForecastData']();
      fixture.detectChanges();
      
      forecastCards = fixture.debugElement.queryAll(By.css('.forecast-card'));
      expect(forecastCards.length).toBe(1);
    });

    it('should update view when weather report changes', () => {
      weatherService.getForecast.and.returnValue(of([mockForecastDay]));
      weatherService.getWeatherReport.and.returnValue(of(null as any));
      component['loadForecastData']();
      fixture.detectChanges();
      
      let todayWeather = fixture.debugElement.query(By.css('.today-weather'));
      expect(todayWeather).toBeFalsy();
      
      weatherService.getWeatherReport.and.returnValue(of(mockWeatherReport));
      component['loadForecastData']();
      fixture.detectChanges();
      
      todayWeather = fixture.debugElement.query(By.css('.today-weather'));
      expect(todayWeather).toBeTruthy();
    });

    it('should render formatted forecast text with HTML', () => {
      component.forecast = [mockForecastDay];
      component.weatherReport = mockWeatherReport;
      fixture.detectChanges();
      
      const forecastText = fixture.debugElement.query(By.css('.forecast-text'));
      expect(forecastText.nativeElement.innerHTML).toContain('<p>');
    });

    it('should display author information correctly', () => {
      component.forecast = [mockForecastDay];
      component.weatherReport = mockWeatherReport;
      fixture.detectChanges();
      
      const authorInfo = fixture.debugElement.query(By.css('.author-info small'));
      expect(authorInfo.nativeElement.textContent).toContain(mockWeatherReport.author);
      expect(authorInfo.nativeElement.textContent).toContain(mockWeatherReport.formattedPublishDate);
    });
  });
});
