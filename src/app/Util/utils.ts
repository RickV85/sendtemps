import { LocationObject } from "../Interfaces/interfaces";

export function filterAndSortLocationsAlphaByName(locArr: Array<LocationObject>, selectedType: string) {
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
