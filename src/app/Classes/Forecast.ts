import { ForecastData } from "../Interfaces/interfaces";
import { ForecastPeriod } from "./ForecastPeriod";

export class Forecast {
  periods: ForecastPeriod[];
  constructor(data: ForecastData) {
    this.periods = this.createForecastPeriods(data.properties.periods);
  }

  createForecastPeriods(periodArr: ForecastData["properties"]["periods"]) {
    const forecastPeriods = periodArr.map(
      (period) => new ForecastPeriod(period)
    );
    return forecastPeriods;
  }
}
