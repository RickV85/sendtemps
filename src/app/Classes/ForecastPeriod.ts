
export class ForecastPeriod {
  name: string;
  detailedForecast: string;
  relativeHumidity: {
    value: number;
  };
  icon: string;
  startTime: string;
  endTime: string;
  // Change type to Forecast.periods?
  constructor (data : any) {
    this.name = data.name;
    this.detailedForecast = data.detailedForecast;
    this.relativeHumidity = data.relativeHumidity;
    this.icon = data.icon;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
  }
}