import { Component, signal } from '@angular/core';
import { NavigationComponent, ViewType } from './components/navigation/navigation.component';
import { WeatherMapComponent } from './components/weather/weather-map.component';
import { ForecastComponent } from './components/forecast/forecast.component';

@Component({
  selector: 'app-root',
  imports: [NavigationComponent, WeatherMapComponent, ForecastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('geo-radar');
  currentView = signal<ViewType>('map');

  onViewChange(view: ViewType): void {
    this.currentView.set(view);
  }
}
