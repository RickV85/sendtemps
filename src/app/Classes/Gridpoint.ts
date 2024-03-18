import { LocationDetails } from "../Interfaces/interfaces";

export class Gridpoint {
  forecastUrl: string;
  constructor (data: LocationDetails) {
    this.forecastUrl = data.properties.forecast;
  }
}