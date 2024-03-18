import { HourlyForecastData } from "../Interfaces/interfaces";

export class HourlyForecastPeriod {
  startTime: string;
  endTime: string;
  time: string;
  temp: number;
  conditions: string;
  precip: number | null;
  wind: {
    speed: string;
    direction: string;
  };
  humidity: number;
  constructor(data: HourlyForecastData["properties"]["periods"][number]) {
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.time = null;
    this.temp = data.temperature;
    this.conditions = data.shortForecast;
    this.precip = data.probabilityOfPrecipitation.value;
    this.wind = { speed: data.windSpeed, direction: data.windDirection };
    this.humidity = data.relativeHumidity.value;
  }
}
