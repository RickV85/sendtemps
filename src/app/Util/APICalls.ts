import { ForecastData } from "../Interfaces/interfaces";
import { UserLocation } from "../Classes/UserLocation";

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
    throw new Error(`Failed to fetch NOAA Forecast.`);
  } catch (err) {
    console.error(`Error fetching NOAA forecast:`, err);
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

// VERCEL POSTGRES DB CALLS

// For immediate DB update, bypass caching with this header:
// { cache: "no-store" }
// Otherwise use Next revalidation time in seconds:
// { next: { revalidate: 3600 } }
// which validates data at maximum once an hour

// default_locations

export async function getAllDefaultLocations() {
  try {
    const response = await fetch("/api/default_locations", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`Error in getAllDefaultLocations: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}

// user_locations

export async function getAllUserLocations(userId: string) {
  try {
    const response = await fetch(`/api/user_locations?user_id=${userId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Error in getAllUserLocations: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}

export async function getUserLocationById(userId: string, id: string) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sendtemps.vercel.app";
  try {
    const response = await fetch(
      `${baseUrl}/api/user_locations?user_id=${userId}&id=${id}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`Error in getUserLocationById: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}

interface NewUserLoc {
  name: string;
  latitude: string;
  longitude: string;
  user_id: string;
  poi_type: string;
}

export async function postNewUserLocation(userLoc: NewUserLoc) {
  try {
    const response = await fetch("/api/user_locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLoc),
      credentials: "include",
    });

    if (response.status === 201) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(
        `Error response postNewUserLocation: ${JSON.stringify(errorData)}`
      );
    }
  } catch (error) {
    return error;
  }
}

export async function patchUserLocation(
  userLoc: UserLocation,
  changeCol: string,
  data: string
) {
  const reqBody = {
    id: userLoc.id,
    userId: userLoc.user_id,
    changeCol: changeCol,
    data: data,
  };
  try {
    const response = await fetch("/api/user_locations", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(
        `Error response patchUserLocation: ${JSON.stringify(errorData)}`
      );
    }
  } catch (error) {
    return error;
  }
}

export async function deleteUserLocation(locId: number, userId: string) {
  const reqBody = {
    id: locId,
    user_id: userId,
  };
  try {
    const response = await fetch("/api/user_locations", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(
        `Error response deleteUserLocation: ${JSON.stringify(errorData)}`
      );
    }
  } catch (error) {
    return error;
  }
}
