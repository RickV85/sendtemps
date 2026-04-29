import { http, HttpResponse } from 'msw';

import {
  makeForecastData,
  makeHourlyForecastData,
  makeLocationDetails,
  makeUserLocationRow,
  makeUserRow,
} from './factories';

export const handlers = [
  // ── NOAA ─────────────────────────────────────────────────────────────────

  http.get('https://api.weather.gov/points/:coords', () =>
    HttpResponse.json(makeLocationDetails()),
  ),

  http.get('https://api.weather.gov/gridpoints/:office/:gridXY/forecast', () =>
    HttpResponse.json(makeForecastData()),
  ),

  http.get('https://api.weather.gov/gridpoints/:office/:gridXY/forecast/hourly', () =>
    HttpResponse.json(makeHourlyForecastData()),
  ),

  // ── Internal: default_locations ───────────────────────────────────────────

  http.get('/api/default_locations', () =>
    HttpResponse.json([
      {
        id: 1,
        latitude: '40.7128',
        longitude: '-74.0060',
        name: 'New York City',
        poi_type: 'other',
      },
    ]),
  ),

  // ── Internal: user_locations ──────────────────────────────────────────────

  http.get('/api/user_locations', () => HttpResponse.json([makeUserLocationRow()])),

  http.post('/api/user_locations', () =>
    HttpResponse.json(makeUserLocationRow({ id: 99 }), { status: 201 }),
  ),

  http.patch('/api/user_locations', () =>
    HttpResponse.json({ message: 'Location updated successfully.' }),
  ),

  http.delete('/api/user_locations', () =>
    HttpResponse.json({ message: 'Location deleted successfully.' }),
  ),

  // ── Internal: users ───────────────────────────────────────────────────────

  http.get('/api/users', () => HttpResponse.json(makeUserRow())),

  http.post('/api/users', () => HttpResponse.json(makeUserRow(), { status: 201 })),

  http.patch('/api/users', () => HttpResponse.json({ message: 'User updated successfully.' })),

  // ── Internal: open_ai/send_score ──────────────────────────────────────────

  http.post('/api/open_ai/send_score', () =>
    HttpResponse.json({
      forecastPeriods: [{ name: 'Today', sendScore: 80 }],
      summary: 'Great conditions for outdoor activity.',
    }),
  ),
];
