import {
  HourlyForecastData,
  HourlyForecastParams,
} from "../Interfaces/interfaces";
import { HourlyForecastPeriod } from "./HourlyForecastPeriod";

export class HourlyForecast {
  hourlyPeriods: HourlyForecastPeriod[];
  constructor(hourlyData: HourlyForecastData) {
    this.hourlyPeriods = hourlyData.properties.periods.map(
      (periodData) => new HourlyForecastPeriod(periodData)
    );
  }

  filterHourlyPeriodsByTime(
    hourlyParams: HourlyForecastParams
  ): HourlyForecastPeriod[] {
    const result = this.hourlyPeriods.filter((period) => {
      const date = new Date(period.startTime);
      const start = new Date(hourlyParams.start);
      const end = new Date(hourlyParams.end);
      if (date >= start && date < end) {
        return true;
      }
    });
    return result;
  }

  getMinMaxRHForTimePeriod(hourlyParams: HourlyForecastParams) {
    const filteredTimePeriods = this.filterHourlyPeriodsByTime(hourlyParams);
    const humidityValues = filteredTimePeriods.map(
      (hourlyPeriod: HourlyForecastPeriod) => hourlyPeriod.humidity
    );

    return {min: Math.min(...humidityValues), max: Math.max(...humidityValues)};
  }
}
