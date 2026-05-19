import { User } from '@/app/Classes/User';
import { UserLocation } from '@/app/Classes/UserLocation';
import type {
  ForecastData,
  HourlyForecastData,
  LocationDetails,
} from '@/app/Interfaces/interfaces';

// ── Raw DB row shapes (plain objects, not class instances) ────────────────────

export interface UserRow {
  date_created: string;
  email: string;
  id: string;
  last_login: string;
  last_modified: string;
  name: string;
}

export interface UserLocationRow {
  date_created: string;
  id: number;
  last_modified: string;
  latitude: string;
  longitude: string;
  name: string;
  poi_type: string;
  user_id: string;
}

// ── User ──────────────────────────────────────────────────────────────────────

export function makeUser(overrides: Partial<UserRow> = {}): User {
  const defaults: UserRow = {
    date_created: '2024-01-01T00:00:00.000Z',
    email: 'test@example.com',
    id: 'user-test-id',
    last_login: '2024-01-01T00:00:00.000Z',
    last_modified: '2024-01-01T00:00:00.000Z',
    name: 'Test User',
  };
  const data = { ...defaults, ...overrides };
  return new User(
    data.id,
    data.email,
    data.name,
    data.last_login,
    data.date_created,
    data.last_modified,
  );
}

export function makeUserRow(overrides: Partial<UserRow> = {}): UserRow {
  return {
    date_created: '2024-01-01T00:00:00.000Z',
    email: 'test@example.com',
    id: 'user-test-id',
    last_login: '2024-01-01T00:00:00.000Z',
    last_modified: '2024-01-01T00:00:00.000Z',
    name: 'Test User',
    ...overrides,
  };
}

// ── UserLocation ──────────────────────────────────────────────────────────────

export function makeUserLocation(overrides: Partial<UserLocationRow> = {}): UserLocation {
  const defaults: UserLocationRow = {
    date_created: '2024-01-01T00:00:00.000Z',
    id: 1,
    last_modified: '2024-01-01T00:00:00.000Z',
    latitude: '40.7128',
    longitude: '-74.0060',
    name: 'Test Location',
    poi_type: 'climb',
    user_id: 'user-test-id',
  };
  const data = { ...defaults, ...overrides };
  return new UserLocation(
    data.id,
    data.name,
    data.latitude,
    data.longitude,
    data.user_id,
    data.poi_type,
    data.date_created,
    data.last_modified,
  );
}

export function makeUserLocationRow(overrides: Partial<UserLocationRow> = {}): UserLocationRow {
  return {
    date_created: '2024-01-01T00:00:00.000Z',
    id: 1,
    last_modified: '2024-01-01T00:00:00.000Z',
    latitude: '40.7128',
    longitude: '-74.0060',
    name: 'Test Location',
    poi_type: 'climb',
    user_id: 'user-test-id',
    ...overrides,
  };
}

// ── NOAA: LocationDetails ─────────────────────────────────────────────────────

export function makeLocationDetails(
  overrides: Partial<LocationDetails['properties']> = {},
): LocationDetails {
  return {
    '@context': [
      'https://geojson.org/geojson-ld/geojson-context.jsonld',
      {
        '@version': '1.1',
        '@vocab': 'https://api.weather.gov/ontology#',
        bearing: { '@type': 'xsd:integer' },
        city: 's:addressLocality',
        county: { '@type': '@id' },
        distance: { '@id': 's:distance', '@type': 's:QuantitativeValue' },
        forecastGridData: { '@type': '@id' },
        forecastOffice: { '@type': '@id' },
        geo: 'http://www.opengis.net/ont/geosparql#',
        geometry: {
          '@id': 's:GeoCoordinates',
          '@type': 'geo:wktLiteral',
        },
        publicZone: { '@type': '@id' },
        s: 'https://schema.org/',
        state: 's:addressRegion',
        unit: 'http://codes.wmo.int/common/unit/',
        unitCode: {
          '@id': 's:unitCode',
          '@type': '@id',
        },
        value: { '@id': 's:value' },
        wx: 'https://api.weather.gov/ontology#',
      },
    ],
    geometry: {
      coordinates: [-74.006, 40.7128],
      type: 'Point',
    },
    id: 'https://api.weather.gov/points/40.7128,-74.0060',
    properties: {
      '@id': 'https://api.weather.gov/points/40.7128,-74.0060',
      '@type': 'wx:Point',
      county: 'https://api.weather.gov/zones/county/NYC061',
      cwa: 'OKX',
      fireWeatherZone: 'https://api.weather.gov/zones/fire/NYZ212',
      forecast: 'https://api.weather.gov/gridpoints/OKX/33,37/forecast',
      forecastGridData: 'https://api.weather.gov/gridpoints/OKX/33,37',
      forecastHourly: 'https://api.weather.gov/gridpoints/OKX/33,37/forecast/hourly',
      forecastOffice: 'https://api.weather.gov/offices/OKX',
      forecastZone: 'https://api.weather.gov/zones/forecast/NYZ072',
      gridId: 'OKX',
      gridX: 33,
      gridY: 37,
      observationStations: 'https://api.weather.gov/gridpoints/OKX/33,37/stations',
      radarStation: 'KOKX',
      relativeLocation: {
        geometry: {
          coordinates: [-74.006, 40.7128],
          type: 'Point',
        },
        properties: {
          bearing: { unitCode: 'wmoUnit:degree_(angle)', value: 0 },
          city: 'Test City',
          distance: { unitCode: 'wmoUnit:km', value: 0 },
          state: 'NY',
        },
        type: 'Feature',
      },
      timeZone: 'America/New_York',
      ...overrides,
    },
    type: 'Feature',
  };
}

// ── NOAA: ForecastData (daily) ────────────────────────────────────────────────

export function makeForecastPeriod(
  overrides: Partial<ForecastData['properties']['periods'][number]> = {},
): ForecastData['properties']['periods'][number] {
  return {
    detailedForecast: 'Sunny with a high near 75.',
    dewpoint: { unitCode: 'wmoUnit:degC', value: 10 },
    endTime: '2024-06-15T18:00:00-04:00',
    icon: 'https://api.weather.gov/icons/land/day/skc?size=medium',
    isDaytime: true,
    name: 'Today',
    number: 1,
    probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 10 },
    relativeHumidity: { unitCode: 'wmoUnit:percent', value: 55 },
    shortForecast: 'Sunny',
    startTime: '2024-06-15T06:00:00-04:00',
    temperature: 75,
    temperatureTrend: null,
    temperatureUnit: 'F',
    windDirection: 'NW',
    windSpeed: '10 mph',
    ...overrides,
  };
}

export function makeForecastData(
  overrides: Partial<ForecastData['properties']> = {},
): ForecastData {
  return {
    '@context': [
      'https://geojson.org/geojson-ld/geojson-context.jsonld',
      {
        '@version': '1.1',
        '@vocab': 'https://api.weather.gov/ontology#',
        geo: 'http://www.opengis.net/ont/geosparql#',
        unit: 'http://codes.wmo.int/common/unit/',
        wx: 'https://api.weather.gov/ontology#',
      },
    ],
    geometry: {
      coordinates: [[[-74.006, 40.7128]]],
      type: 'Polygon',
    },
    properties: {
      elevation: { unitCode: 'wmoUnit:m', value: 10 },
      forecastGenerator: 'BaselineForecastGenerator',
      generatedAt: '2024-06-15T10:00:00+00:00',
      periods: [
        makeForecastPeriod({ isDaytime: true, name: 'Today', number: 1 }),
        makeForecastPeriod({
          isDaytime: false,
          name: 'Tonight',
          number: 2,
          startTime: '2024-06-15T18:00:00-04:00',
          temperature: 58,
        }),
      ],
      units: 'us',
      updateTime: '2024-06-15T09:30:00+00:00',
      updated: '2024-06-15T09:30:00+00:00',
      validTimes: '2024-06-15T09:00:00+00:00/P7DT3H',
      ...overrides,
    },
    type: 'Feature',
  };
}

// ── NOAA: HourlyForecastData ──────────────────────────────────────────────────

export function makeHourlyForecastPeriod(
  overrides: Partial<HourlyForecastData['properties']['periods'][number]> = {},
): HourlyForecastData['properties']['periods'][number] {
  return {
    detailedForecast: '',
    dewpoint: { unitCode: 'wmoUnit:degC', value: 10 },
    endTime: '2024-06-15T07:00:00-04:00',
    icon: 'https://api.weather.gov/icons/land/day/skc?size=small',
    isDaytime: true,
    name: '',
    number: 1,
    probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 5 },
    relativeHumidity: { unitCode: 'wmoUnit:percent', value: 60 },
    shortForecast: 'Clear',
    startTime: '2024-06-15T06:00:00-04:00',
    temperature: 68,
    temperatureTrend: null,
    temperatureUnit: 'F',
    windDirection: 'N',
    windSpeed: '5 mph',
    ...overrides,
  };
}

export function makeHourlyForecastData(
  overrides: Partial<HourlyForecastData['properties']> = {},
): HourlyForecastData {
  return {
    '@context': [
      'https://geojson.org/geojson-ld/geojson-context.jsonld',
      {
        '@version': '1.1',
        '@vocab': 'https://api.weather.gov/ontology#',
        geo: 'http://www.opengis.net/ont/geosparql#',
        unit: 'http://codes.wmo.int/common/unit/',
        wx: 'https://api.weather.gov/ontology#',
      },
    ],
    geometry: {
      coordinates: [[[-74.006, 40.7128]]],
      type: 'Polygon',
    },
    properties: {
      elevation: { unitCode: 'wmoUnit:m', value: 10 },
      forecastGenerator: 'HourlyForecastGenerator',
      generatedAt: '2024-06-15T10:00:00+00:00',
      periods: Array.from({ length: 12 }, (_, i) =>
        makeHourlyForecastPeriod({
          endTime: `2024-06-15T${String(7 + i).padStart(2, '0')}:00:00-04:00`,
          number: i + 1,
          startTime: `2024-06-15T${String(6 + i).padStart(2, '0')}:00:00-04:00`,
          temperature: 68 + i,
        }),
      ),
      units: 'us',
      updateTime: '2024-06-15T09:30:00+00:00',
      updated: '2024-06-15T09:30:00+00:00',
      validTimes: '2024-06-15T09:00:00+00:00/P7DT3H',
      ...overrides,
    },
    type: 'Feature',
  };
}
