import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ForecastDayDTO, WeatherReportDTO } from '../../models/weather-response.dto';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss'
})
export class ForecastComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  forecast: ForecastDayDTO[] = [];
  weatherReport: WeatherReportDTO | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadForecastData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadForecastData(): void {
    this.weatherService.getForecast()
      .pipe(takeUntil(this.destroy$))
      .subscribe(forecast => {
        this.forecast = forecast;
      });

    this.weatherService.getWeatherReport()
      .pipe(takeUntil(this.destroy$))
      .subscribe(report => {
        this.weatherReport = report;
      });
  }

  formatForecastDay(day: string, isToday: boolean): string {
    if (isToday) return 'Today';

    const date = new Date(day);
    
    // Handle invalid dates
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  formatForecastText(text: string): string {
    // Convert line breaks and clean up the text
    return text
      .replace(/&nbsp;/g, ' ')
      .replace(/([.!?])\s*([A-Z])/g, '$1</p><p>$2')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }
}
