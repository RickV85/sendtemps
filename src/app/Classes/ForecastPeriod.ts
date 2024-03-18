import { ForecastData } from "../Interfaces/interfaces";
export class ForecastPeriod {
  name: string;
  detailedForecast: string;
  relativeHumidity: {
    value: number;
  };
  icon: string;
  startTime: string;
  endTime: string;
  constructor (data : ForecastData["properties"]["periods"][number]) {
    this.name = data.name;
    this.detailedForecast = data.detailedForecast;
    this.relativeHumidity = data.relativeHumidity;
    this.icon = data.icon;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
  }
}