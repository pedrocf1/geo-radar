import { DataType, WeatherColor } from '../models/whether.model';
import { WEATHER_COLORS } from '../constants/wheter.constant';

export class WeatherColorsUtil {
  
  static getColorForValue(value: number, dataType: DataType): string {
    switch (dataType) {
      case DataType.temperature:
        return this.getTemperatureColor(value);
      case DataType.wind:
        return this.getWindColor(value);
      case DataType.windspeed:
        return this.getWindColor(value);
      case DataType.winddirection:
        return this.getWindDirectionColor(value);
      case DataType.pressure:
        return this.getPressureColor(value);
      default:
        return WEATHER_COLORS.DEFAULT_BLUE;
    }
  }

  static getTemperatureColor(temp: number): string {
    if (temp < 0) return WEATHER_COLORS.DEEP_BLUE;
    if (temp < 5) return WEATHER_COLORS.ROYAL_BLUE;
    if (temp < 10) return WEATHER_COLORS.DEEP_SKY_BLUE;
    if (temp < 15) return WEATHER_COLORS.LIME_GREEN;
    if (temp < 20) return WEATHER_COLORS.YELLOW;
    if (temp < 25) return WEATHER_COLORS.ORANGE;
    if (temp < 30) return WEATHER_COLORS.ORANGE_RED;
    return WEATHER_COLORS.RED;
  }

  static getWindColor(windSpeed: number): string {
    if (windSpeed < 2) return WEATHER_COLORS.LIGHTEST_BLUE;
    if (windSpeed < 5) return WEATHER_COLORS.LIGHT_BLUE;
    if (windSpeed < 8) return WEATHER_COLORS.MEDIUM_BLUE;
    if (windSpeed < 12) return WEATHER_COLORS.STRONG_BLUE;
    if (windSpeed < 16) return WEATHER_COLORS.DEEP_BLUE_WIND;
    if (windSpeed < 20) return WEATHER_COLORS.DARKER_BLUE;
    return WEATHER_COLORS.DARKEST_BLUE;
  }

  static getWindDirectionColor(degrees: number): string {
    // Normalize degrees to 0-360 range
    const normalizedDegrees = ((degrees % 360) + 360) % 360;
    
    // Map wind direction to colors based on compass directions
    if (normalizedDegrees >= 337.5 || normalizedDegrees < 22.5) return WEATHER_COLORS.LIGHTEST_BLUE; // N
    if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) return WEATHER_COLORS.LIGHT_BLUE; // NE
    if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) return WEATHER_COLORS.MEDIUM_BLUE; // E
    if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) return WEATHER_COLORS.STRONG_BLUE; // SE
    if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) return WEATHER_COLORS.DEEP_BLUE_WIND; // S
    if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) return WEATHER_COLORS.DARKER_BLUE; // SW
    if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) return WEATHER_COLORS.DARKEST_BLUE; // W
    return WEATHER_COLORS.ROYAL_BLUE; // NW
  }

  static getPressureColor(pressure: number): string {
    if (pressure < 1000) return WEATHER_COLORS.PRESSURE_RED;
    if (pressure < 1010) return WEATHER_COLORS.PRESSURE_ORANGE;
    if (pressure < 1015) return WEATHER_COLORS.PRESSURE_YELLOW;
    if (pressure < 1020) return WEATHER_COLORS.PRESSURE_YELLOW_GREEN;
    if (pressure < 1025) return WEATHER_COLORS.PRESSURE_GREEN;
    if (pressure < 1030) return WEATHER_COLORS.PRESSURE_GREEN_CYAN;
    return WEATHER_COLORS.PRESSURE_CYAN;
  }

  static getTextColor(backgroundColor: string): string {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? WEATHER_COLORS.BLACK : WEATHER_COLORS.WHITE;
  }

  static getLegendItems(dataType: DataType): WeatherColor[] {
    switch (dataType) {
      case DataType.temperature:
        return [
          { color: WEATHER_COLORS.DEEP_BLUE, label: '< 0°C' },
          { color: WEATHER_COLORS.ROYAL_BLUE, label: '0-5°C' },
          { color: WEATHER_COLORS.DEEP_SKY_BLUE, label: '5-10°C' },
          { color: WEATHER_COLORS.LIME_GREEN, label: '10-15°C' },
          { color: WEATHER_COLORS.YELLOW, label: '15-20°C' },
          { color: WEATHER_COLORS.ORANGE, label: '20-25°C' },
          { color: WEATHER_COLORS.ORANGE_RED, label: '25-30°C' },
          { color: WEATHER_COLORS.RED, label: '> 30°C' }
        ];
      case DataType.wind:
        return [
          { color: WEATHER_COLORS.LIGHTEST_BLUE, label: '< 2 m/s' },
          { color: WEATHER_COLORS.LIGHT_BLUE, label: '2-5 m/s' },
          { color: WEATHER_COLORS.MEDIUM_BLUE, label: '5-8 m/s' },
          { color: WEATHER_COLORS.STRONG_BLUE, label: '8-12 m/s' },
          { color: WEATHER_COLORS.DEEP_BLUE_WIND, label: '12-16 m/s' },
          { color: WEATHER_COLORS.DARKER_BLUE, label: '16-20 m/s' },
          { color: WEATHER_COLORS.DARKEST_BLUE, label: '> 20 m/s' }
        ];
      case DataType.windspeed:
        return [
          { color: WEATHER_COLORS.LIGHTEST_BLUE, label: '< 2 m/s' },
          { color: WEATHER_COLORS.LIGHT_BLUE, label: '2-5 m/s' },
          { color: WEATHER_COLORS.MEDIUM_BLUE, label: '5-8 m/s' },
          { color: WEATHER_COLORS.STRONG_BLUE, label: '8-12 m/s' },
          { color: WEATHER_COLORS.DEEP_BLUE_WIND, label: '12-16 m/s' },
          { color: WEATHER_COLORS.DARKER_BLUE, label: '16-20 m/s' },
          { color: WEATHER_COLORS.DARKEST_BLUE, label: '> 20 m/s' }
        ];
      case DataType.winddirection:
        return [
          { color: WEATHER_COLORS.LIGHTEST_BLUE, label: 'N (0°)' },
          { color: WEATHER_COLORS.LIGHT_BLUE, label: 'NE (45°)' },
          { color: WEATHER_COLORS.MEDIUM_BLUE, label: 'E (90°)' },
          { color: WEATHER_COLORS.STRONG_BLUE, label: 'SE (135°)' },
          { color: WEATHER_COLORS.DEEP_BLUE_WIND, label: 'S (180°)' },
          { color: WEATHER_COLORS.DARKER_BLUE, label: 'SW (225°)' },
          { color: WEATHER_COLORS.DARKEST_BLUE, label: 'W (270°)' },
          { color: WEATHER_COLORS.ROYAL_BLUE, label: 'NW (315°)' }
        ];
      case DataType.pressure:
        return [
          { color: WEATHER_COLORS.PRESSURE_RED, label: '< 1000 hPa' },
          { color: WEATHER_COLORS.PRESSURE_ORANGE, label: '1000-1010 hPa' },
          { color: WEATHER_COLORS.PRESSURE_YELLOW, label: '1010-1015 hPa' },
          { color: WEATHER_COLORS.PRESSURE_YELLOW_GREEN, label: '1015-1020 hPa' },
          { color: WEATHER_COLORS.PRESSURE_GREEN, label: '1020-1025 hPa' },
          { color: WEATHER_COLORS.PRESSURE_GREEN_CYAN, label: '1025-1030 hPa' },
          { color: WEATHER_COLORS.PRESSURE_CYAN, label: '> 1030 hPa' }
        ];
      default:
        return [];
    }
  }
}
