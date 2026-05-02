import { UserLocation } from '../Classes/UserLocation';
import { LocationObject, GoogleMapPoint } from '../Interfaces/interfaces';

export function filterAndSortLocationsAlphaByName(
  locArr: Array<LocationObject>,
  selectedType: string,
): Array<LocationObject> {
  return locArr
    .filter((loc) => loc.poi_type === selectedType)
    .toSorted((a, b) => a.name.localeCompare(b.name));
}

export const createGoogleMapPoints = (locs: LocationObject[] | UserLocation[]) => {
  const points = locs.map((location): GoogleMapPoint => {
    const coords = {
      lat: +location.latitude,
      lng: +location.longitude,
    };
    return { name: location.name, poiType: location.poi_type, coords };
  });
  return points;
};

export const formatPOIDataForDisplay = (poi: string): string => {
  switch (poi) {
    case 'climb':
      return 'Climbing';
    case 'mtb':
      return 'Mountain Biking';
    case 'ski':
      return 'Skiing';
    case 'other':
      return 'Other';
    default:
      return 'Unknown';
  }
};

export const findLocByIdInUserLocs = (
  searchLocId: number,
  userLocations: UserLocation[] | null,
): UserLocation | undefined => {
  if (userLocations?.length) {
    return userLocations?.find((loc) => loc.id === searchLocId);
  } else {
    console.log('Array of userLocations is empty');
    return undefined;
  }
};

export const resetErrorMsg = (errorMsgStateSet: React.Dispatch<React.SetStateAction<string>>) => {
  setTimeout(() => {
    errorMsgStateSet('');
  }, 1500);
};
