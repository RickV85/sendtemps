import { ForecastData } from "../Interfaces/interfaces";

export async function fetchNoaaGridLocation(coords: string) {
  const response = await fetch(`https://api.weather.gov/points/${coords}`);
  if (!response.ok) {
    throw new Error("Request to fetch location grid point failed.");
  }
  return response.json();
}

export async function fetchNoaaGridLocationWithRetry(
  coords: string,
  retries: number = 5,
  delay: number = 2000
) {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fetchNoaaGridLocation(coords);
    } catch (err) {
      console.error(
        `Fetch NOAA grid location attempt ${i} failed for coordinates: ${coords}`
      );
      if (i === retries) {
        throw new Error("All fetch NOAA grid location attempts failed.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error();
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
