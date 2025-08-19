import { DataType, WeatherColor } from "../models/whether.model";

// Weather Color Palette - Unified hexadecimal colors
export const WEATHER_COLORS = {
  // Temperature colors (cool to warm)
  DEEP_BLUE: '#0000ff',
  ROYAL_BLUE: '#4169e1',
  DEEP_SKY_BLUE: '#00bfff',
  LIME_GREEN: '#00ff00',
  YELLOW: '#ffff00',
  ORANGE: '#ffa500',
  ORANGE_RED: '#ff4500',
  RED: '#ff0000',
  
  // Wind colors (light to strong)
  LIGHTEST_BLUE: '#e6f3ff',
  LIGHT_BLUE: '#b3d9ff',
  MEDIUM_BLUE: '#80bfff',
  STRONG_BLUE: '#4da6ff',
  DEEP_BLUE_WIND: '#1a8cff',
  DARKER_BLUE: '#0066cc',
  DARKEST_BLUE: '#004499',
  
  // Pressure colors (low to high)
  PRESSURE_RED: '#ff0000',
  PRESSURE_ORANGE: '#ff8000',
  PRESSURE_YELLOW: '#ffff00',
  PRESSURE_YELLOW_GREEN: '#80ff00',
  PRESSURE_GREEN: '#00ff00',
  PRESSURE_GREEN_CYAN: '#00ff80',
  PRESSURE_CYAN: '#00ffff',
  
  // UI colors
  DEFAULT_BLUE: '#3388ff',
  BLACK: '#000',
  WHITE: '#fff',
  DARK_GRAY: '#333'
} as const;

export const DATA_TYPES: DataType[] = [
  DataType.temperature, 
  DataType.wind, 
  DataType.windspeed, 
  DataType.winddirection, 
  DataType.pressure
];


export const TEMPERATURE_COLORS: { [key in DataType]: WeatherColor[] } = {
    temperature:[
        { color: WEATHER_COLORS.DEEP_BLUE, label: '< 0°C' },
        { color: WEATHER_COLORS.ROYAL_BLUE, label: '0-5°C' },
        { color: WEATHER_COLORS.DEEP_SKY_BLUE, label: '5-10°C' },
        { color: WEATHER_COLORS.LIME_GREEN, label: '10-15°C' },
        { color: WEATHER_COLORS.YELLOW, label: '15-20°C' },
        { color: WEATHER_COLORS.ORANGE, label: '20-25°C' },
        { color: WEATHER_COLORS.ORANGE_RED, label: '25-30°C' },
        { color: WEATHER_COLORS.RED, label: '> 30°C' }
    ],
    wind:[
        { color: WEATHER_COLORS.LIGHTEST_BLUE, label: '< 2 m/s' },
        { color: WEATHER_COLORS.LIGHT_BLUE, label: '2-5 m/s' },
        { color: WEATHER_COLORS.MEDIUM_BLUE, label: '5-8 m/s' },
        { color: WEATHER_COLORS.STRONG_BLUE, label: '8-12 m/s' },
        { color: WEATHER_COLORS.DEEP_BLUE_WIND, label: '12-16 m/s' },
        { color: WEATHER_COLORS.DARKER_BLUE, label: '16-20 m/s' },
        { color: WEATHER_COLORS.DARKEST_BLUE, label: '> 20 m/s' }
    ],
    pressure:[
        { color: WEATHER_COLORS.PRESSURE_RED, label: '< 1000 hPa' },
        { color: WEATHER_COLORS.PRESSURE_ORANGE, label: '1000-1010 hPa' },
        { color: WEATHER_COLORS.PRESSURE_YELLOW, label: '1010-1015 hPa' },
        { color: WEATHER_COLORS.PRESSURE_YELLOW_GREEN, label: '1015-1020 hPa' },
        { color: WEATHER_COLORS.PRESSURE_GREEN, label: '1020-1025 hPa' },
        { color: WEATHER_COLORS.PRESSURE_GREEN_CYAN, label: '1025-1030 hPa' },
        { color: WEATHER_COLORS.PRESSURE_CYAN, label: '> 1030 hPa' }
    ],
    windspeed:[
        { color: WEATHER_COLORS.LIGHTEST_BLUE, label: '< 2 m/s' },
        { color: WEATHER_COLORS.LIGHT_BLUE, label: '2-5 m/s' },
        { color: WEATHER_COLORS.MEDIUM_BLUE, label: '5-8 m/s' },
        { color: WEATHER_COLORS.STRONG_BLUE, label: '8-12 m/s' },
        { color: WEATHER_COLORS.DEEP_BLUE_WIND, label: '12-16 m/s' },
        { color: WEATHER_COLORS.DARKER_BLUE, label: '16-20 m/s' },
        { color: WEATHER_COLORS.DARKEST_BLUE, label: '> 20 m/s' }
    ],
    winddirection:[
        { color: WEATHER_COLORS.LIGHTEST_BLUE, label: 'N (0°)' },
        { color: WEATHER_COLORS.LIGHT_BLUE, label: 'NE (45°)' },
        { color: WEATHER_COLORS.MEDIUM_BLUE, label: 'E (90°)' },
        { color: WEATHER_COLORS.STRONG_BLUE, label: 'SE (135°)' },
        { color: WEATHER_COLORS.DEEP_BLUE_WIND, label: 'S (180°)' },
        { color: WEATHER_COLORS.DARKER_BLUE, label: 'SW (225°)' },
        { color: WEATHER_COLORS.DARKEST_BLUE, label: 'W (270°)' },
        { color: WEATHER_COLORS.ROYAL_BLUE, label: 'NW (315°)' }
    ]
};
export const DATA_TYPE_LABEL: { [key in DataType]: string } = {
   temperature: 'Temperature',
   wind: 'Wind (Speed + Direction)',
   windspeed: 'Wind Speed',
   winddirection: 'Wind Direction',
   pressure: 'Air Pressure',
}

