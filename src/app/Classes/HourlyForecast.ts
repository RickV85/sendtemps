import { HourlyForecastData } from "../Interfaces/interfaces";
import { HourlyForecastPeriod } from "./HourlyForecastPeriod";

export class HourlyForecast {
  hourlyPeriods: HourlyForecastPeriod[];
  constructor(hourlyData: HourlyForecastData) {
    this.hourlyPeriods = hourlyData.properties.periods.map(
      (periodData) => new HourlyForecastPeriod(periodData)
    );
  }

  filterHourlyPeriodsByTime(timeParams: {
    startTime: string;
    endTime: string;
  }): HourlyForecastPeriod[] {
    const result = this.hourlyPeriods.filter((period) => {
      const date = new Date(period.startTime);
      const start = new Date(timeParams.startTime);
      const end = new Date(timeParams.endTime);
      if (date >= start && date < end) {
        return true;
      }
    });
    return result;
  }
}
