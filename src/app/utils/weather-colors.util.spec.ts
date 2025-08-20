import { WeatherColorsUtil } from './weather-colors.util';
import { DataType } from '../models/whether.model';
import { WEATHER_COLORS } from '../constants/wheter.constant';

describe('WeatherColorsUtil', () => {

  describe('getColorForValue', () => {
    it('should return temperature color for temperature data type', () => {
      const color = WeatherColorsUtil.getColorForValue(12, DataType.temperature);
      expect(color).toBe(WEATHER_COLORS.LIME_GREEN);
    });

    it('should return wind color for wind data type', () => {
      const color = WeatherColorsUtil.getColorForValue(5, DataType.wind);
      expect(color).toBe(WEATHER_COLORS.MEDIUM_BLUE);
    });

    it('should return wind color for windspeed data type', () => {
      const color = WeatherColorsUtil.getColorForValue(5, DataType.windspeed);
      expect(color).toBe(WEATHER_COLORS.MEDIUM_BLUE);
    });

    it('should return wind direction color for winddirection data type', () => {
      const color = WeatherColorsUtil.getColorForValue(90, DataType.winddirection);
      expect(color).toBe(WEATHER_COLORS.MEDIUM_BLUE);
    });

    it('should return pressure color for pressure data type', () => {
      const color = WeatherColorsUtil.getColorForValue(1015, DataType.pressure);
      expect(color).toBe(WEATHER_COLORS.PRESSURE_YELLOW_GREEN);
    });

    it('should return default blue for unknown data type', () => {
      const color = WeatherColorsUtil.getColorForValue(10, 'unknown' as DataType);
      expect(color).toBe(WEATHER_COLORS.DEFAULT_BLUE);
    });
  });

  describe('getTemperatureColor', () => {
    it('should return deep blue for temperature below 0', () => {
      expect(WeatherColorsUtil.getTemperatureColor(-5)).toBe(WEATHER_COLORS.DEEP_BLUE);
      expect(WeatherColorsUtil.getTemperatureColor(-1)).toBe(WEATHER_COLORS.DEEP_BLUE);
    });

    it('should return royal blue for temperature 0-5°C', () => {
      expect(WeatherColorsUtil.getTemperatureColor(0)).toBe(WEATHER_COLORS.ROYAL_BLUE);
      expect(WeatherColorsUtil.getTemperatureColor(3)).toBe(WEATHER_COLORS.ROYAL_BLUE);
      expect(WeatherColorsUtil.getTemperatureColor(4.9)).toBe(WEATHER_COLORS.ROYAL_BLUE);
    });

    it('should return deep sky blue for temperature 5-10°C', () => {
      expect(WeatherColorsUtil.getTemperatureColor(5)).toBe(WEATHER_COLORS.DEEP_SKY_BLUE);
      expect(WeatherColorsUtil.getTemperatureColor(7)).toBe(WEATHER_COLORS.DEEP_SKY_BLUE);
      expect(WeatherColorsUtil.getTemperatureColor(9.9)).toBe(WEATHER_COLORS.DEEP_SKY_BLUE);
    });

    it('should return lime green for temperature 10-15°C', () => {
      expect(WeatherColorsUtil.getTemperatureColor(10)).toBe(WEATHER_COLORS.LIME_GREEN);
      expect(WeatherColorsUtil.getTemperatureColor(12)).toBe(WEATHER_COLORS.LIME_GREEN);
      expect(WeatherColorsUtil.getTemperatureColor(14.9)).toBe(WEATHER_COLORS.LIME_GREEN);
    });

    it('should return yellow for temperature 15-20°C', () => {
      expect(WeatherColorsUtil.getTemperatureColor(15)).toBe(WEATHER_COLORS.YELLOW);
      expect(WeatherColorsUtil.getTemperatureColor(18)).toBe(WEATHER_COLORS.YELLOW);
      expect(WeatherColorsUtil.getTemperatureColor(19.9)).toBe(WEATHER_COLORS.YELLOW);
    });

    it('should return orange for temperature 20-25°C', () => {
      expect(WeatherColorsUtil.getTemperatureColor(20)).toBe(WEATHER_COLORS.ORANGE);
      expect(WeatherColorsUtil.getTemperatureColor(22)).toBe(WEATHER_COLORS.ORANGE);
      expect(WeatherColorsUtil.getTemperatureColor(24.9)).toBe(WEATHER_COLORS.ORANGE);
    });

    it('should return orange red for temperature 25-30°C', () => {
      expect(WeatherColorsUtil.getTemperatureColor(25)).toBe(WEATHER_COLORS.ORANGE_RED);
      expect(WeatherColorsUtil.getTemperatureColor(27)).toBe(WEATHER_COLORS.ORANGE_RED);
      expect(WeatherColorsUtil.getTemperatureColor(29.9)).toBe(WEATHER_COLORS.ORANGE_RED);
    });

    it('should return red for temperature 30°C and above', () => {
      expect(WeatherColorsUtil.getTemperatureColor(30)).toBe(WEATHER_COLORS.RED);
      expect(WeatherColorsUtil.getTemperatureColor(35)).toBe(WEATHER_COLORS.RED);
      expect(WeatherColorsUtil.getTemperatureColor(50)).toBe(WEATHER_COLORS.RED);
    });
  });

  describe('getWindColor', () => {
    it('should return lightest blue for wind speed below 2 m/s', () => {
      expect(WeatherColorsUtil.getWindColor(0)).toBe(WEATHER_COLORS.LIGHTEST_BLUE);
      expect(WeatherColorsUtil.getWindColor(1.9)).toBe(WEATHER_COLORS.LIGHTEST_BLUE);
    });

    it('should return light blue for wind speed 2-5 m/s', () => {
      expect(WeatherColorsUtil.getWindColor(2)).toBe(WEATHER_COLORS.LIGHT_BLUE);
      expect(WeatherColorsUtil.getWindColor(3.5)).toBe(WEATHER_COLORS.LIGHT_BLUE);
      expect(WeatherColorsUtil.getWindColor(4.9)).toBe(WEATHER_COLORS.LIGHT_BLUE);
    });

    it('should return medium blue for wind speed 5-8 m/s', () => {
      expect(WeatherColorsUtil.getWindColor(5)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
      expect(WeatherColorsUtil.getWindColor(6.5)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
      expect(WeatherColorsUtil.getWindColor(7.9)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
    });

    it('should return strong blue for wind speed 8-12 m/s', () => {
      expect(WeatherColorsUtil.getWindColor(8)).toBe(WEATHER_COLORS.STRONG_BLUE);
      expect(WeatherColorsUtil.getWindColor(10)).toBe(WEATHER_COLORS.STRONG_BLUE);
      expect(WeatherColorsUtil.getWindColor(11.9)).toBe(WEATHER_COLORS.STRONG_BLUE);
    });

    it('should return deep blue wind for wind speed 12-16 m/s', () => {
      expect(WeatherColorsUtil.getWindColor(12)).toBe(WEATHER_COLORS.DEEP_BLUE_WIND);
      expect(WeatherColorsUtil.getWindColor(14)).toBe(WEATHER_COLORS.DEEP_BLUE_WIND);
      expect(WeatherColorsUtil.getWindColor(15.9)).toBe(WEATHER_COLORS.DEEP_BLUE_WIND);
    });

    it('should return darker blue for wind speed 16-20 m/s', () => {
      expect(WeatherColorsUtil.getWindColor(16)).toBe(WEATHER_COLORS.DARKER_BLUE);
      expect(WeatherColorsUtil.getWindColor(18)).toBe(WEATHER_COLORS.DARKER_BLUE);
      expect(WeatherColorsUtil.getWindColor(19.9)).toBe(WEATHER_COLORS.DARKER_BLUE);
    });

    it('should return darkest blue for wind speed 20 m/s and above', () => {
      expect(WeatherColorsUtil.getWindColor(20)).toBe(WEATHER_COLORS.DARKEST_BLUE);
      expect(WeatherColorsUtil.getWindColor(25)).toBe(WEATHER_COLORS.DARKEST_BLUE);
      expect(WeatherColorsUtil.getWindColor(50)).toBe(WEATHER_COLORS.DARKEST_BLUE);
    });
  });

  describe('getWindDirectionColor', () => {
    it('should return correct color for North (0°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(0)).toBe(WEATHER_COLORS.LIGHTEST_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(360)).toBe(WEATHER_COLORS.LIGHTEST_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(10)).toBe(WEATHER_COLORS.LIGHTEST_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(350)).toBe(WEATHER_COLORS.LIGHTEST_BLUE);
    });

    it('should return correct color for Northeast (45°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(45)).toBe(WEATHER_COLORS.LIGHT_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(30)).toBe(WEATHER_COLORS.LIGHT_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(60)).toBe(WEATHER_COLORS.LIGHT_BLUE);
    });

    it('should return correct color for East (90°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(90)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(80)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(100)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
    });

    it('should return correct color for Southeast (135°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(135)).toBe(WEATHER_COLORS.STRONG_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(120)).toBe(WEATHER_COLORS.STRONG_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(150)).toBe(WEATHER_COLORS.STRONG_BLUE);
    });

    it('should return correct color for South (180°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(180)).toBe(WEATHER_COLORS.DEEP_BLUE_WIND);
      expect(WeatherColorsUtil.getWindDirectionColor(170)).toBe(WEATHER_COLORS.DEEP_BLUE_WIND);
      expect(WeatherColorsUtil.getWindDirectionColor(190)).toBe(WEATHER_COLORS.DEEP_BLUE_WIND);
    });

    it('should return correct color for Southwest (225°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(225)).toBe(WEATHER_COLORS.DARKER_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(210)).toBe(WEATHER_COLORS.DARKER_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(240)).toBe(WEATHER_COLORS.DARKER_BLUE);
    });

    it('should return correct color for West (270°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(270)).toBe(WEATHER_COLORS.DARKEST_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(260)).toBe(WEATHER_COLORS.DARKEST_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(280)).toBe(WEATHER_COLORS.DARKEST_BLUE);
    });

    it('should return correct color for Northwest (315°)', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(315)).toBe(WEATHER_COLORS.ROYAL_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(300)).toBe(WEATHER_COLORS.ROYAL_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(330)).toBe(WEATHER_COLORS.ROYAL_BLUE);
    });

    it('should handle negative degrees correctly', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(-45)).toBe(WEATHER_COLORS.ROYAL_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(-90)).toBe(WEATHER_COLORS.DARKEST_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(-180)).toBe(WEATHER_COLORS.DEEP_BLUE_WIND);
    });

    it('should handle degrees greater than 360 correctly', () => {
      expect(WeatherColorsUtil.getWindDirectionColor(450)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(720)).toBe(WEATHER_COLORS.LIGHTEST_BLUE);
      expect(WeatherColorsUtil.getWindDirectionColor(810)).toBe(WEATHER_COLORS.MEDIUM_BLUE);
    });
  });

  describe('getPressureColor', () => {
    it('should return red for pressure below 1000 hPa', () => {
      expect(WeatherColorsUtil.getPressureColor(950)).toBe(WEATHER_COLORS.PRESSURE_RED);
      expect(WeatherColorsUtil.getPressureColor(999)).toBe(WEATHER_COLORS.PRESSURE_RED);
    });

    it('should return orange for pressure 1000-1010 hPa', () => {
      expect(WeatherColorsUtil.getPressureColor(1000)).toBe(WEATHER_COLORS.PRESSURE_ORANGE);
      expect(WeatherColorsUtil.getPressureColor(1005)).toBe(WEATHER_COLORS.PRESSURE_ORANGE);
      expect(WeatherColorsUtil.getPressureColor(1009)).toBe(WEATHER_COLORS.PRESSURE_ORANGE);
    });

    it('should return yellow for pressure 1010-1015 hPa', () => {
      expect(WeatherColorsUtil.getPressureColor(1010)).toBe(WEATHER_COLORS.PRESSURE_YELLOW);
      expect(WeatherColorsUtil.getPressureColor(1012)).toBe(WEATHER_COLORS.PRESSURE_YELLOW);
      expect(WeatherColorsUtil.getPressureColor(1014)).toBe(WEATHER_COLORS.PRESSURE_YELLOW);
    });

    it('should return yellow green for pressure 1015-1020 hPa', () => {
      expect(WeatherColorsUtil.getPressureColor(1015)).toBe(WEATHER_COLORS.PRESSURE_YELLOW_GREEN);
      expect(WeatherColorsUtil.getPressureColor(1018)).toBe(WEATHER_COLORS.PRESSURE_YELLOW_GREEN);
      expect(WeatherColorsUtil.getPressureColor(1019)).toBe(WEATHER_COLORS.PRESSURE_YELLOW_GREEN);
    });

    it('should return green for pressure 1020-1025 hPa', () => {
      expect(WeatherColorsUtil.getPressureColor(1020)).toBe(WEATHER_COLORS.PRESSURE_GREEN);
      expect(WeatherColorsUtil.getPressureColor(1022)).toBe(WEATHER_COLORS.PRESSURE_GREEN);
      expect(WeatherColorsUtil.getPressureColor(1024)).toBe(WEATHER_COLORS.PRESSURE_GREEN);
    });

    it('should return green cyan for pressure 1025-1030 hPa', () => {
      expect(WeatherColorsUtil.getPressureColor(1025)).toBe(WEATHER_COLORS.PRESSURE_GREEN_CYAN);
      expect(WeatherColorsUtil.getPressureColor(1027)).toBe(WEATHER_COLORS.PRESSURE_GREEN_CYAN);
      expect(WeatherColorsUtil.getPressureColor(1029)).toBe(WEATHER_COLORS.PRESSURE_GREEN_CYAN);
    });

    it('should return cyan for pressure 1030 hPa and above', () => {
      expect(WeatherColorsUtil.getPressureColor(1030)).toBe(WEATHER_COLORS.PRESSURE_CYAN);
      expect(WeatherColorsUtil.getPressureColor(1040)).toBe(WEATHER_COLORS.PRESSURE_CYAN);
      expect(WeatherColorsUtil.getPressureColor(1100)).toBe(WEATHER_COLORS.PRESSURE_CYAN);
    });
  });

  describe('getTextColor', () => {
    it('should return black for light backgrounds', () => {
      expect(WeatherColorsUtil.getTextColor('#ffffff')).toBe(WEATHER_COLORS.BLACK);
      expect(WeatherColorsUtil.getTextColor('#ffff00')).toBe(WEATHER_COLORS.BLACK);
      expect(WeatherColorsUtil.getTextColor('#00ff00')).toBe(WEATHER_COLORS.BLACK);
      expect(WeatherColorsUtil.getTextColor('#e6f3ff')).toBe(WEATHER_COLORS.BLACK);
    });

    it('should return white for dark backgrounds', () => {
      expect(WeatherColorsUtil.getTextColor('#000000')).toBe(WEATHER_COLORS.WHITE);
      expect(WeatherColorsUtil.getTextColor('#0000ff')).toBe(WEATHER_COLORS.WHITE);
      expect(WeatherColorsUtil.getTextColor('#004499')).toBe(WEATHER_COLORS.WHITE);
      expect(WeatherColorsUtil.getTextColor('#ff0000')).toBe(WEATHER_COLORS.WHITE);
    });

    it('should handle colors without # prefix', () => {
      expect(WeatherColorsUtil.getTextColor('ffffff')).toBe(WEATHER_COLORS.BLACK);
      expect(WeatherColorsUtil.getTextColor('000000')).toBe(WEATHER_COLORS.WHITE);
    });

    it('should handle medium brightness colors correctly', () => {
      expect(WeatherColorsUtil.getTextColor('#808080')).toBe(WEATHER_COLORS.WHITE);
      expect(WeatherColorsUtil.getTextColor('#a0a0a0')).toBe(WEATHER_COLORS.BLACK);
    });
  });

  describe('getLegendItems', () => {
    it('should return temperature legend items', () => {
      const legend = WeatherColorsUtil.getLegendItems(DataType.temperature);
      expect(legend.length).toBe(8);
      expect(legend[0]).toEqual({ color: WEATHER_COLORS.DEEP_BLUE, label: '< 0°C' });
      expect(legend[7]).toEqual({ color: WEATHER_COLORS.RED, label: '> 30°C' });
    });

    it('should return wind legend items', () => {
      const legend = WeatherColorsUtil.getLegendItems(DataType.wind);
      expect(legend.length).toBe(7);
      expect(legend[0]).toEqual({ color: WEATHER_COLORS.LIGHTEST_BLUE, label: '< 2 m/s' });
      expect(legend[6]).toEqual({ color: WEATHER_COLORS.DARKEST_BLUE, label: '> 20 m/s' });
    });

    it('should return windspeed legend items', () => {
      const legend = WeatherColorsUtil.getLegendItems(DataType.windspeed);
      expect(legend.length).toBe(7);
      expect(legend[0]).toEqual({ color: WEATHER_COLORS.LIGHTEST_BLUE, label: '< 2 m/s' });
      expect(legend[6]).toEqual({ color: WEATHER_COLORS.DARKEST_BLUE, label: '> 20 m/s' });
    });

    it('should return wind direction legend items', () => {
      const legend = WeatherColorsUtil.getLegendItems(DataType.winddirection);
      expect(legend.length).toBe(8);
      expect(legend[0]).toEqual({ color: WEATHER_COLORS.LIGHTEST_BLUE, label: 'N (0°)' });
      expect(legend[7]).toEqual({ color: WEATHER_COLORS.ROYAL_BLUE, label: 'NW (315°)' });
    });

    it('should return pressure legend items', () => {
      const legend = WeatherColorsUtil.getLegendItems(DataType.pressure);
      expect(legend.length).toBe(7);
      expect(legend[0]).toEqual({ color: WEATHER_COLORS.PRESSURE_RED, label: '< 1000 hPa' });
      expect(legend[6]).toEqual({ color: WEATHER_COLORS.PRESSURE_CYAN, label: '> 1030 hPa' });
    });

    it('should return empty array for unknown data type', () => {
      const legend = WeatherColorsUtil.getLegendItems('unknown' as DataType);
      expect(legend).toEqual([]);
    });
  });
});
