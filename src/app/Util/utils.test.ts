import {
  createGoogleMapPoints,
  filterAndSortLocationsAlphaByName,
  findLocByIdInUserLocs,
  formatPOIDataForDisplay,
  resetErrorMsg,
} from './utils';
import { UserLocation } from '../Classes/UserLocation';
import { LocationObject } from '../Interfaces/interfaces';

describe('filterAndSortLocationsAlphaByName', () => {
  const locations: LocationObject[] = [
    { id: 1, latitude: '40', longitude: '-74', name: 'Zion', poi_type: 'climb' },
    { id: 2, latitude: '41', longitude: '-75', name: 'Acadia', poi_type: 'climb' },
    { id: 3, latitude: '42', longitude: '-76', name: 'Mesa', poi_type: 'ski' },
    { id: 4, latitude: '43', longitude: '-77', name: 'Boulder', poi_type: 'climb' },
  ];

  it('filters by type and sorts alphabetically', () => {
    const result = filterAndSortLocationsAlphaByName(locations, 'climb');
    expect(result.map((l) => l.name)).toEqual(['Acadia', 'Boulder', 'Zion']);
  });

  it('returns empty array when no locations match the type', () => {
    const result = filterAndSortLocationsAlphaByName(locations, 'mtb');
    expect(result).toEqual([]);
  });

  it('returns empty array when input is empty', () => {
    const result = filterAndSortLocationsAlphaByName([], 'climb');
    expect(result).toEqual([]);
  });
});

describe('createGoogleMapPoints', () => {
  it('converts LocationObjects with numeric coercion', () => {
    const locs: LocationObject[] = [
      { id: 1, latitude: '40.7128', longitude: '-74.006', name: 'NYC', poi_type: 'other' },
    ];
    const result = createGoogleMapPoints(locs);
    expect(result).toEqual([
      { coords: { lat: 40.7128, lng: -74.006 }, name: 'NYC', poiType: 'other' },
    ]);
  });

  it('converts UserLocation instances', () => {
    const loc = new UserLocation(1, 'Test', '39.5', '-105.2', 'user-1', 'climb', null, null);
    const result = createGoogleMapPoints([loc]);
    expect(result).toHaveLength(1);
    expect(result[0].coords).toEqual({ lat: 39.5, lng: -105.2 });
  });
});

describe('formatPOIDataForDisplay', () => {
  it.each([
    ['climb', 'Climbing'],
    ['mtb', 'Mountain Biking'],
    ['other', 'Other'],
    ['ski', 'Skiing'],
  ])('returns "%s" → "%s"', (input, expected) => {
    expect(formatPOIDataForDisplay(input)).toBe(expected);
  });

  it('returns "Unknown" for unrecognized input', () => {
    expect(formatPOIDataForDisplay('surf')).toBe('Unknown');
  });
});

describe('findLocByIdInUserLocs', () => {
  const loc1 = new UserLocation(1, 'A', '40', '-74', 'u1', 'climb', null, null);
  const loc2 = new UserLocation(2, 'B', '41', '-75', 'u1', 'ski', null, null);

  it('returns the matching location', () => {
    expect(findLocByIdInUserLocs(2, [loc1, loc2])).toBe(loc2);
  });

  it('returns undefined when id does not match', () => {
    expect(findLocByIdInUserLocs(99, [loc1, loc2])).toBeUndefined();
  });

  it('returns undefined and logs when array is empty', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(findLocByIdInUserLocs(1, [])).toBeUndefined();
    expect(spy).toHaveBeenCalledWith('Array of userLocations is empty');
    spy.mockRestore();
  });

  it('returns undefined and logs when array is null', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(findLocByIdInUserLocs(1, null)).toBeUndefined();
    expect(spy).toHaveBeenCalledWith('Array of userLocations is empty');
    spy.mockRestore();
  });
});

describe('resetErrorMsg', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('clears the error message after 1500ms', () => {
    const setter = jest.fn();
    resetErrorMsg(setter);
    expect(setter).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1500);
    expect(setter).toHaveBeenCalledWith('');
  });
});
