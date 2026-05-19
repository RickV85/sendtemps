import { makeLocationDetails } from '@/test/factories';

import { Gridpoint } from './Gridpoint';

describe('Gridpoint', () => {
  it('extracts forecastUrl from location details', () => {
    const data = makeLocationDetails({
      forecast: 'https://api.weather.gov/gridpoints/OKX/33,37/forecast',
    });
    const gridpoint = new Gridpoint(data);
    expect(gridpoint.forecastUrl).toBe('https://api.weather.gov/gridpoints/OKX/33,37/forecast');
  });
});
