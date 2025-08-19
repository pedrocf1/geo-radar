import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherDataInfo } from '../../services/weather.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as L from 'leaflet';
import { DataType, WeatherColor } from '../../models/whether.model';
import { WeatherStationDTO } from '../../models/wheatherStation.dto';
import { DATA_TYPE_LABEL } from '../../constants/wheter.constant';
import { WeatherColorsUtil } from '../../utils/weather-colors.util';
import { WeatherTemplatesUtil } from '../../utils/weather-templates.util';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

@Component({
  selector: 'app-weather-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-map.component.html',
  styleUrl: './weather-map.component.scss'
})
export class WeatherMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: L.Map;
  private destroy$ = new Subject<void>();
  private markers: L.Marker[] = [];
  private windArrows: L.Marker[] = [];

  stations = signal<WeatherStationDTO[]>([]);
  selectedStation = signal<WeatherStationDTO | null>(null);
  selectedDataType: DataType = DataType.temperature;
  type_label = DATA_TYPE_LABEL;
  DataType = DataType;

  showAirPressure = computed(() => {
    return this.selectedStation()?.airpressure !== undefined && this.selectedStation()?.airpressure !== null;
  });

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.selectedDataType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dataType => {
        this.selectedDataType = dataType;
        this.buildMarkers();
      });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.loadWeatherData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    this.map = L.map('weather-map').setView([52.2, 5.2], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadWeatherData(): void {
    this.weatherService.getStations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stations => {
        this.stations.set(stations);
        this.buildMarkers();
      });
  }

  private buildMarkers(): void {
    this.clearMarkers();
    this.stations().forEach(station => {
      if (!station.lat || !station.lon) {
        console.error('Station missing coordinates:', station.stationname);
        return;
      }

      const weatherInfo = this.weatherService.buildWeatherDataInfo(station, this.selectedDataType);
      
      if (!weatherInfo.hasData) {
        console.log(`Station ${station.stationname} skipped - no ${this.selectedDataType} data`);
        return;
      }

      const markerIcon = this.createCustomMarker(weatherInfo.color, weatherInfo.value, weatherInfo.unit);
      
      if (!markerIcon) {
        console.error('Failed to create marker for station:', station.stationname);
        return;
      }

      try {
        const marker = L.marker([station.lat, station.lon], { icon: markerIcon })
          .addTo(this.map);

        if (this.selectedDataType === DataType.wind || this.selectedDataType === DataType.winddirection) {
          if (station.winddirectiondegrees !== undefined && station.winddirectiondegrees !== null) {
            this.addWindDirectionIndicator(station);
          }
        }

        marker.on('click', () => {
          this.selectedStation.set(station);
        });

        this.createTooltipContent(station, marker);

        this.markers.push(marker);
      } catch (error) {
        console.error('Error creating marker for station:', station.stationname, error);
      }
    });
  }

  private createCustomMarker(color: string, value: number, unit: string): L.DivIcon | null {
    if (!color || isNaN(value) || value === null || value === undefined) {
      console.error('Invalid marker data:', { color, value, unit });
      return null;
    }

    const displayValue = this.selectedDataType === DataType.temperature ? 
      Math.round(value) : 
      this.selectedDataType === DataType.winddirection ?
      Math.round(value) :
      Math.round(value * 10) / 10;
    
    try {
      const iconSize = 30;
      return L.divIcon({
        className: 'custom-marker',
        html: WeatherTemplatesUtil.createMarkerHtml(color, iconSize, displayValue, unit),
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2]
      });
    } catch (error) {
      console.error('Error creating divIcon:', error);
      return null;
    }
  }

  private addWindDirectionIndicator(station: WeatherStationDTO): void {
    const windArrow = L.divIcon({
      className: 'wind-arrow',
      html: WeatherTemplatesUtil.createWindArrowHtml(station.winddirectiondegrees),
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const arrowMarker = L.marker([station.lat, station.lon], { icon: windArrow }).addTo(this.map);
    this.windArrows.push(arrowMarker);
  }

  private createTooltipContent(station: WeatherStationDTO, marker: L.Marker<any>): void {
    const weatherInfo = this.weatherService.buildWeatherDataInfo(station, this.selectedDataType);
    const tooltipHtml = WeatherTemplatesUtil.createTooltipHtml(station, weatherInfo, this.selectedDataType);
    
    marker.bindTooltip(tooltipHtml, {
      direction: 'top',
      offset: [0, -10]
    });
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];

    this.windArrows.forEach(arrow => {
      this.map.removeLayer(arrow);
    });
    this.windArrows = [];
  }

  selectDataType(dataType: DataType): void {
    this.weatherService.setSelectedDataType(dataType);
  }

  getLegendItems(): { color: string; label: string }[] {
    return WeatherColorsUtil.getLegendItems(this.selectedDataType);
  }

  closeInfoPanel(): void {
    this.selectedStation.set(null);
  }
}
