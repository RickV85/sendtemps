import { ForecastData } from "../Interfaces/interfaces";

export class Forecast {
  periods: object[];
  constructor (data : ForecastData) {
    this.periods = data.properties.periods;
  }
}