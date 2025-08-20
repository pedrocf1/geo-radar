# Geo Radar - Netherlands Weather Dashboard

A modern, interactive weather dashboard application built with Angular 20 that displays real-time weather data for the Netherlands using the Buienradar API.

## 🌤️ Features

- **Interactive Weather Map**: Visual representation of weather stations across the Netherlands using Leaflet maps
- **Real-time Data**: Live weather information from Buienradar API
- **Multiple Data Views**: Toggle between different weather metrics:
  - Temperature
  - Humidity
  - Wind Speed
  - Precipitation
  - Air Pressure
  - And more...
- **Weather Forecast**: 5-day weather forecast with detailed information
- **Responsive Design**: Optimized for desktop and mobile devices
- **Color-coded Visualization**: Weather data displayed with intuitive color schemes

## 🚀 Tech Stack

- **Frontend**: Angular 20 (Standalone Components)
- **Maps**: Leaflet with custom weather overlays
- **Styling**: SCSS with modern design principles
- **HTTP Client**: Angular HttpClient for API communication
- **Testing**: Jasmine & Karma with code coverage
- **Build Tools**: Angular CLI

## 📦 Dependencies

### Main Dependencies
- Angular 20.1.0
- Leaflet 1.9.4
- RxJS 7.8.0
- TypeScript 5.8.2

### Development Dependencies
- Angular CLI 20.1.6
- Karma & Jasmine for testing
- Code coverage tools

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pedrocf1/geo-radar.git
   cd geo-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── forecast/          # Weather forecast component
│   │   ├── navigation/        # Navigation component
│   │   └── weather/           # Interactive weather map
│   ├── constants/             # Application constants
│   ├── models/                # TypeScript interfaces and DTOs
│   ├── services/              # Weather API service
│   └── utils/                 # Utility functions for colors and templates
├── index.html
├── main.ts
└── styles.scss
```

## 🌍 Data Source

This application uses the [Buienradar API](https://data.buienradar.nl/2.0/feed/json) to fetch:
- Real-time weather station data
- Weather forecasts
- Meteorological measurements across the Netherlands

## 🎨 Features Overview

### Weather Map Component
- Interactive map with weather station markers
- Real-time data visualization with color coding
- Clickable stations for detailed information
- Multiple weather parameter views

### Forecast Component
- 5-day weather forecast
- Detailed daily weather reports
- Temperature, humidity, and precipitation data

### Navigation Component
- Switch between map and forecast views
- Data type selection for map visualization

## 🧪 Testing

The project includes comprehensive unit tests with:
- Component testing
- Service testing
- Utility function testing
- Code coverage reporting

Run tests with:
```bash
npm test
```

Generate coverage report:
```bash
npm run test:coverage
```

## 🎯 Code Quality

- **Prettier**: Code formatting with custom Angular HTML parser
- **TypeScript**: Strict typing for better code quality
- **SCSS**: Modular styling with component-scoped styles
- **Angular Best Practices**: Standalone components, signals, and modern Angular patterns

## 🚀 Deployment

Build the application for production:
```bash
npm run build
```