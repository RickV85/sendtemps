import { Forecast } from "./Forecast";

export class OpenAIForecastData {
  sport: string;
  forecastPeriods: {
    name: string;
    detailedForecast: string;
  }[];
  constructor(sport: string, forecast: Forecast) {
    this.sport = sport;
    this.forecastPeriods = this.createForecastPeriods(forecast);
  }

  createForecastPeriods(data: Forecast) {
    const periods = data.periods.map((per) => {
      return {
        name: per.name,
        detailedForecast: per.detailedForecast,
      };
    });
    return periods;
  }
}
