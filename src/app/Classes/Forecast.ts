import { ForecastData } from "../Interfaces/interfaces";
import { ForecastPeriod } from "./ForecastPeriod";

export class Forecast {
  periods: ForecastPeriod[];
  constructor(data: ForecastData) {
    this.periods = this.createForecastPeriods(data);
  }

  createForecastPeriods(data: ForecastData) {
    const forecastPeriods = data.properties.periods.map(
      (periodData) => new ForecastPeriod(periodData)
    );
    return forecastPeriods;
  }
}
