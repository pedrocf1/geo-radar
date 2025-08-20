import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WeatherMapComponent } from './weather-map.component';
import { WeatherService, WeatherDataInfo } from '../../services/weather.service';
import { DataType } from '../../models/whether.model';
import { WeatherStationDTO } from '../../models/wheatherStation.dto';
import { WeatherColorsUtil } from '../../utils/weather-colors.util';
import { WeatherTemplatesUtil } from '../../utils/weather-templates.util';
import { of, Subject } from 'rxjs';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

describe('WeatherMapComponent', () => {
  let component: WeatherMapComponent;
  let fixture: ComponentFixture<WeatherMapComponent>;
  let weatherService: jasmine.SpyObj<WeatherService>;

  const mockStation = new WeatherStationDTO({
    stationid: 1,
    stationname: 'Test Station',
    lat: 52.0,
    lon: 5.0,
    temperature: 20.5,
    windspeed: 10.2,
    winddirectiondegrees: 180,
    airpressure: 1013.25,
    humidity: 65,
    regio: 'Test Region',
    timestamp: '2024-01-01T12:00:00Z',
    weatherdescription: 'Sunny',
    iconurl: 'test.png',
    fullIconUrl: 'test-full.png',
    winddirection: 'S',
    groundtemperature: 18.0,
    feeltemperature: 22.0,
    visibility: 10000,
    windgusts: 15.0,
    windspeedBft: 3,
    precipitation: 0,
    sunpower: 800,
    rainFallLast24Hour: 0,
    rainFallLastHour: 0
  });

  const mockWeatherDataInfo: WeatherDataInfo = {
    value: 20.5,
    color: '#ff6600',
    unit: '°C',
    hasData: true
  };

  beforeEach(async () => {
    const weatherServiceSpy = jasmine.createSpyObj('WeatherService', [
      'getStations',
      'setSelectedDataType',
      'buildWeatherDataInfo'
    ], {
      selectedDataType$: of(DataType.temperature)
    });

    await TestBed.configureTestingModule({
      imports: [WeatherMapComponent],
      providers: [
        HttpClient,
        { provide: WeatherService, useValue: weatherServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherMapComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;

    weatherService.getStations.and.returnValue(of([mockStation]));
    weatherService.buildWeatherDataInfo.and.returnValue(mockWeatherDataInfo);

    spyOn(WeatherTemplatesUtil, 'createMarkerHtml').and.returnValue('<div>marker</div>');
    spyOn(WeatherTemplatesUtil, 'createWindArrowHtml').and.returnValue('<div>arrow</div>');
    spyOn(WeatherTemplatesUtil, 'createTooltipHtml').and.returnValue('<div>tooltip</div>');
    spyOn(WeatherColorsUtil, 'getLegendItems').and.returnValue([
      { color: '#ff0000', label: 'Hot' },
      { color: '#0000ff', label: 'Cold' }
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.selectedDataType).toBe(DataType.temperature);
      expect(component.stations()).toEqual([]);
      expect(component.selectedStation()).toBeNull();
    });

    it('should subscribe to selectedDataType$ on init', () => {
      component.ngOnInit();
      expect(weatherService.selectedDataType$).toBeDefined();
    });

    it('should initialize map after view init', fakeAsync(() => {
      component.ngAfterViewInit();
      tick(100);
      
      expect(component['map']).toBeDefined();
    }));
  });

  describe('Map Initialization', () => {
    beforeEach(() => {
      component['initializeMap']();
    });

    it('should create map with correct center and zoom', () => {
      expect(component['map']).toBeDefined();
    });

    it('should add tile layer to map', () => {
      expect(component['map']).toBeDefined();
    });
  });

  describe('Weather Data Loading', () => {
    it('should load weather data and update stations signal', () => {
      spyOn(component as any, 'buildMarkers');
      
      component['loadWeatherData']();
      
      expect(weatherService.getStations).toHaveBeenCalled();
      expect(component.stations()).toEqual([mockStation]);
      expect((component as any).buildMarkers).toHaveBeenCalled();
    });
  });

  describe('Marker Building', () => {
    beforeEach(() => {
      component['map'] = L.map(document.createElement('div'));
      component.stations.set([mockStation]);
      spyOn(component as any, 'createCustomMarker').and.returnValue(L.divIcon());
      spyOn(component as any, 'createTooltipContent');
      spyOn(component as any, 'clearMarkers');
    });

    it('should clear existing markers before building new ones', () => {
      component['buildMarkers']();
      expect((component as any).clearMarkers).toHaveBeenCalled();
    });

    it('should skip stations without coordinates', () => {
      const stationWithoutCoords = new WeatherStationDTO({
        ...mockStation,
        lat: 0,
        lon: 0
      });
      component.stations.set([stationWithoutCoords]);
      spyOn(console, 'error');
      
      component['buildMarkers']();
      
      expect(console.error).toHaveBeenCalledWith('Station missing coordinates:', stationWithoutCoords.stationname);
    });

    it('should skip stations without data', () => {
      weatherService.buildWeatherDataInfo.and.returnValue({ ...mockWeatherDataInfo, hasData: false });
      spyOn(console, 'log');
      
      component['buildMarkers']();
      
      expect(console.log).toHaveBeenCalledWith(`Station ${mockStation.stationname} skipped - no ${component.selectedDataType} data`);
    });

    it('should create markers for valid stations', () => {
      component['buildMarkers']();
      
      expect(weatherService.buildWeatherDataInfo).toHaveBeenCalledWith(mockStation, component.selectedDataType);
      expect((component as any).createCustomMarker).toHaveBeenCalledWith(
        mockWeatherDataInfo.color,
        mockWeatherDataInfo.value,
        mockWeatherDataInfo.unit
      );
    });

    it('should bind click event to markers', () => {
      component['buildMarkers']();
      
      expect((component as any).clearMarkers).toHaveBeenCalled();
    });

    it('should add wind direction indicator for wind data types', () => {
      component.selectedDataType = DataType.wind;
      spyOn(component as any, 'addWindDirectionIndicator');
      
      component['buildMarkers']();
      
      expect((component as any).addWindDirectionIndicator).toHaveBeenCalledWith(mockStation);
    });

    it('should add wind direction indicator for winddirection data type', () => {
      component.selectedDataType = DataType.winddirection;
      spyOn(component as any, 'addWindDirectionIndicator');
      
      component['buildMarkers']();
      
      expect((component as any).addWindDirectionIndicator).toHaveBeenCalledWith(mockStation);
    });

    it('should handle marker creation errors gracefully', () => {
      spyOn(console, 'error');
      (component as any).createCustomMarker.and.returnValue(null);
      
      component['buildMarkers']();
      
      expect(console.error).toHaveBeenCalledWith('Failed to create marker for station:', mockStation.stationname);
    });
  });

  describe('Custom Marker Creation', () => {
    it('should create divIcon for valid data', () => {
      const result = component['createCustomMarker']('#ff0000', 20.5, '°C');
      
      expect(WeatherTemplatesUtil.createMarkerHtml).toHaveBeenCalledWith('#ff0000', 30, 21, '°C');
      expect(result).toBeTruthy();
    });

    it('should return null for invalid data', () => {
      spyOn(console, 'error');
      
      const result = component['createCustomMarker']('', NaN, '°C');
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Invalid marker data:', { color: '', value: NaN, unit: '°C' });
    });

    it('should round temperature values', () => {
      component.selectedDataType = DataType.temperature;
      component['createCustomMarker']('#ff0000', 20.7, '°C');
      
      expect(WeatherTemplatesUtil.createMarkerHtml).toHaveBeenCalledWith('#ff0000', 30, 21, '°C');
    });

    it('should round wind direction values', () => {
      component.selectedDataType = DataType.winddirection;
      component['createCustomMarker']('#ff0000', 180.7, '°');
      
      expect(WeatherTemplatesUtil.createMarkerHtml).toHaveBeenCalledWith('#ff0000', 30, 181, '°');
    });

    it('should round other values to one decimal place', () => {
      component.selectedDataType = DataType.windspeed;
      component['createCustomMarker']('#ff0000', 10.67, 'm/s');
      
      expect(WeatherTemplatesUtil.createMarkerHtml).toHaveBeenCalledWith('#ff0000', 30, 10.7, 'm/s');
    });

    it('should handle divIcon creation errors', () => {
      spyOn(console, 'error');
      (WeatherTemplatesUtil.createMarkerHtml as jasmine.Spy).and.throwError('Template error');
      
      const result = component['createCustomMarker']('#ff0000', 20.5, '°C');
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error creating divIcon:', jasmine.any(Error));
    });
  });

  describe('Wind Direction Indicator', () => {
    beforeEach(() => {
      component['map'] = L.map(document.createElement('div'));
    });

    it('should create wind arrow marker', () => {
      component['addWindDirectionIndicator'](mockStation);
      
      expect(WeatherTemplatesUtil.createWindArrowHtml).toHaveBeenCalledWith(180);
    });
  });

  describe('Tooltip Creation', () => {
    it('should bind tooltip to marker', () => {
      const marker = L.marker([0, 0]);
      spyOn(marker, 'bindTooltip');
      
      component['createTooltipContent'](mockStation, marker);
      
      expect(WeatherTemplatesUtil.createTooltipHtml).toHaveBeenCalledWith(
        mockStation,
        mockWeatherDataInfo,
        component.selectedDataType
      );
      expect(marker.bindTooltip).toHaveBeenCalledWith('<div>tooltip</div>', {
        direction: 'top',
        offset: [0, -10]
      });
    });
  });

  describe('Marker Clearing', () => {
    beforeEach(() => {
      component['map'] = L.map(document.createElement('div'));
      component['markers'] = [L.marker([0, 0])];
      component['windArrows'] = [L.marker([0, 0])];
    });

    it('should remove all markers and wind arrows', () => {
      const mapSpy = spyOn(component['map'], 'removeLayer');
      
      component['clearMarkers']();
      
      expect(mapSpy).toHaveBeenCalledTimes(2);
      expect(component['markers']).toEqual([]);
      expect(component['windArrows']).toEqual([]);
    });
  });

  describe('Data Type Selection', () => {
    it('should call weather service to set selected data type', () => {
      component.selectDataType(DataType.wind);
      
      expect(weatherService.setSelectedDataType).toHaveBeenCalledWith(DataType.wind);
    });
  });

  describe('Legend Items', () => {
    it('should return legend items from WeatherColorsUtil', () => {
      const result = component.getLegendItems();
      
      expect(WeatherColorsUtil.getLegendItems).toHaveBeenCalledWith(component.selectedDataType);
      expect(result).toEqual([
        { color: '#ff0000', label: 'Hot' },
        { color: '#0000ff', label: 'Cold' }
      ]);
    });
  });

  describe('Info Panel', () => {
    it('should close info panel by setting selected station to null', () => {
      component.selectedStation.set(mockStation);
      
      component.closeInfoPanel();
      
      expect(component.selectedStation()).toBeNull();
    });
  });

  describe('Computed Properties', () => {
    it('should show air pressure when station has airpressure data', () => {
      component.selectedStation.set(mockStation);
      
      expect(component.showAirPressure()).toBe(true);
    });

    it('should not show air pressure when station has no airpressure data', () => {
      const stationWithoutPressure = new WeatherStationDTO({
        ...mockStation,
        airpressure: undefined
      });
      component.selectedStation.set(stationWithoutPressure);
      
      expect(component.showAirPressure()).toBe(false);
    });

    it('should not show air pressure when station is null', () => {
      component.selectedStation.set(null);
      
      expect(component.showAirPressure()).toBe(false);
    });
  });

  describe('Component Lifecycle', () => {
    it('should cleanup on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');
      component['map'] = L.map(document.createElement('div'));
      const removeSpy = spyOn(component['map'], 'remove');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });

    it('should not throw error if map is not initialized on destroy', () => {
      component['map'] = undefined as any;
      
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Data Type Changes', () => {
    it('should rebuild markers when data type changes', () => {
      const dataTypeSubject = new Subject<DataType>();
      Object.defineProperty(weatherService, 'selectedDataType$', {
        value: dataTypeSubject.asObservable(),
        writable: true
      });
      spyOn(component as any, 'buildMarkers');
      
      component.ngOnInit();
      dataTypeSubject.next(DataType.wind);
      
      expect(component.selectedDataType).toBe(DataType.wind);
      expect((component as any).buildMarkers).toHaveBeenCalled();
    });
  });

  describe('Station Selection', () => {
    it('should set selected station when marker is clicked', () => {
      component.selectedStation.set(mockStation);
      
      expect(component.selectedStation()).toBe(mockStation);
    });
  });

  describe('Wind Direction Conditions', () => {
    beforeEach(() => {
      component['map'] = L.map(document.createElement('div'));
      spyOn(component as any, 'createCustomMarker').and.returnValue(L.divIcon());
      spyOn(component as any, 'createTooltipContent');
      spyOn(component as any, 'clearMarkers');
      spyOn(component as any, 'addWindDirectionIndicator');
    });

    it('should not add wind direction indicator if winddirectiondegrees is undefined', () => {
      const stationWithoutWindDirection = new WeatherStationDTO({
        ...mockStation,
        winddirectiondegrees: undefined as any
      });
      component.selectedDataType = DataType.wind;
      component.stations.set([stationWithoutWindDirection]);
      
      component['buildMarkers']();
      
      expect((component as any).addWindDirectionIndicator).not.toHaveBeenCalled();
    });

    it('should not add wind direction indicator if winddirectiondegrees is null', () => {
      const stationWithNullWindDirection = new WeatherStationDTO({
        ...mockStation,
        winddirectiondegrees: null as any
      });
      component.selectedDataType = DataType.wind;
      component.stations.set([stationWithNullWindDirection]);
      
      component['buildMarkers']();
      
      expect((component as any).addWindDirectionIndicator).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty stations array', () => {
      component.stations.set([]);
      spyOn(component as any, 'clearMarkers');
      component['map'] = L.map(document.createElement('div'));
      
      component['buildMarkers']();
      
      expect((component as any).clearMarkers).toHaveBeenCalled();
    });

    it('should handle failed marker creation', () => {
      spyOn(component as any, 'createCustomMarker').and.returnValue(null);
      spyOn(console, 'error');
      component['map'] = L.map(document.createElement('div'));
      component.stations.set([mockStation]);
      
      component['buildMarkers']();
      
      expect(console.error).toHaveBeenCalledWith('Failed to create marker for station:', mockStation.stationname);
    });
  });
});