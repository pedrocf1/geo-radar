import { WEATHER_COLORS } from '../constants/wheter.constant';
import { DATA_TYPE_LABEL } from '../constants/wheter.constant';
import { DataType } from '../models/whether.model';
import { WeatherStationDTO } from '../models/wheatherStation.dto';
import { WeatherDataInfo } from '../services/weather.service';
import { WeatherColorsUtil } from './weather-colors.util';

export class WeatherTemplatesUtil {

  static createMarkerHtml(
    color: string, 
    size: number, 
    displayValue: number | string, 
    unit: string
  ): string {
    return `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        color: ${WeatherColorsUtil.getTextColor(color)};
      ">
        ${displayValue}${unit}
      </div>
    `;
  }

  static createWindArrowHtml(windDirectionDegrees: number): string {
    return `
      <div style="
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(${windDirectionDegrees + 180}deg);
        pointer-events: none;
      ">
        <div style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 24px solid ${WEATHER_COLORS.DARK_GRAY};
          margin-right: 40px;
        "></div>
      </div>
    `;
  }

  static createTooltipHtml(
    station: WeatherStationDTO, 
    weatherInfo: WeatherDataInfo, 
    dataType: DataType
  ): string {
    return `
      <div style="text-align: center;">
        <strong>${station.stationname}</strong><br>
        ${DATA_TYPE_LABEL[dataType]}: ${weatherInfo.value}${weatherInfo.unit}<br>
        <small>${station.regio}</small>
      </div>
    `;
  }
}
