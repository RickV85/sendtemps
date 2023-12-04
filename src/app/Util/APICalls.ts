import { ForecastData } from "../Interfaces/interfaces";

export function fetchWeatherSelectedLocation(coords: string) {
  return fetch(`https://api.weather.gov/points/${coords}`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error();
    }
  });
}

export async function fetchDailyForecast(url: string): Promise<ForecastData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Request to fetch daily forecast failed.");
  }
  return response.json();
}

export async function fetchDailyForecastWithRetry(
  url: string,
  retries: number = 5,
  delay: number = 2000
): Promise<ForecastData> {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fetchDailyForecast(url);
    } catch (err) {
      console.error(
        `Fetch Daily Forecast attempt ${i} failed for forecastUrl: ${url}`
      );
      if (i === retries) {
        throw new Error("All fetch Daily Forecast attempts failed.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error();
}
