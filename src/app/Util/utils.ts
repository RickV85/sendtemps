import { LocationObject, GoogleMapPoint, HourlyForecastPeriod } from "../Interfaces/interfaces";
import { UserLocation } from "../Classes/UserLocation";

export function filterAndSortLocationsAlphaByName(
  locArr: Array<LocationObject>,
  selectedType: string
): Array<LocationObject> {
  const filteredSortedLocations = locArr
    .filter((loc) => loc.poi_type === selectedType)
    .toSorted((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  return filteredSortedLocations;
}

export const createGoogleMapPoints = (
  locs: LocationObject[] | UserLocation[]
) => {
  const points = locs.map((location): GoogleMapPoint => {
    const coords = {
      lat: +location.latitude,
      lng: +location.longitude,
    };
    return { name: location.name, poiType: location.poi_type, coords: coords };
  });
  return points;
};

export const formatPOIDataForDisplay = (poi: string): string => {
  switch (poi) {
    case "climb":
      return "Climbing";
    case "mtb":
      return "Mountain Biking";
    case "ski":
      return "Skiing";
    case "other":
      return "Other";
    default:
      return "Unknown";
  }
};

export const findLocByIdInUserLocs = (
  searchLocId: number,
  userLocations: UserLocation[] | null
): UserLocation | undefined => {
  if (userLocations?.length) {
    return userLocations?.find((loc) => loc.id === searchLocId);
  } else {
    console.log("Array of userLocations is empty");
    return undefined;
  }
};

export const resetErrorMsg = (
  errorMsgStateSet: React.Dispatch<React.SetStateAction<string>>
) => {
  setTimeout(() => {
    errorMsgStateSet("");
  }, 1500);
};

export const checkError = (x: any) => {
  if (x instanceof Error) {
    throw x;
  }
};

// export const filterHourlyForecastByTime = (
//   periods: HourlyForecastPeriod[],
//   timeParams: { startTime: string; endTime: string }
// ): HourlyForecastPeriod[] => {
//   const result = periods.filter((period) => {
//     const date = new Date(period.startTime);
//     const start = new Date(timeParams.startTime);
//     const end = new Date(timeParams.endTime);
//     if (date >= start && date < end) {
//       return true;
//     }
//   });
//   return result;
// };
