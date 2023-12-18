import { LocationObject, GoogleMapPoint } from "../Interfaces/interfaces";
import { UserLocation } from "../Classes/UserLocation";

export function filterAndSortLocationsAlphaByName(
  locArr: Array<LocationObject>,
  selectedType: string
): Array<LocationObject> {
  const filteredSortedLocations = locArr
    .filter((loc) => loc.poi_type === selectedType)
    .sort((a, b) => {
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
    return { name: location.name, coords: coords };
  });
  return points;
};
