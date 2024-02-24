import { ForecastData } from "../Interfaces/interfaces";

// NOAA API CALLS

export async function fetchNoaaGridLocation(coords: string) {
  try {
    const response = await fetch(`https://api.weather.gov/points/${coords}`);
    if (response.ok) {
      return response.json();
    }
    throw new Error(
      `Failed to fetch location grid point for coordinates: ${coords}`
    );
  } catch (err) {
    console.error(`Error fetching NOAA grid location for ${coords}:`, err);
    throw err;
  }
}

export async function fetchNoaaGridLocationWithRetry(
  coords: string,
  retries: number = 5,
  delay: number = 2000
) {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fetchNoaaGridLocation(coords);
    } catch {
      console.error(
        `Fetch NOAA grid location attempt ${i} failed for coordinates: ${coords}`
      );
      if (i === retries) {
        throw new Error(
          `All attempts to fetch NOAA grid location failed for coordinates: ${coords}.`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unknown error in fetchNoaaGridLocationWithRetry");
}

export async function fetchDailyForecast(url: string): Promise<ForecastData> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Failed to fetch NOAA daily forecast.`);
  } catch (err) {
    console.error(`Error fetching NOAA daily forecast:`, err);
    throw err;
  }
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
  throw new Error("Unknown error in fetchDailyForecastWithRetry");
}

export async function fetchHourlyForecast(url: string): Promise<ForecastData> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Failed to fetch NOAA hourly forecast.`);
  } catch (err) {
    console.error(`Error fetching NOAA hourly forecast:`, err);
    throw err;
  }
}

export async function fetchHourlyForecastWithRetry(
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
  throw new Error("Unknown error in fetchDailyForecastWithRetry");
}