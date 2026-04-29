import { makeForecastData, makeForecastPeriod } from '@/test/factories';

import { Forecast } from './Forecast';

describe('Forecast', () => {
  it('builds ForecastPeriod instances from data', () => {
    const data = makeForecastData({
      periods: [
        makeForecastPeriod({ name: 'Saturday' }),
        makeForecastPeriod({ name: 'Today' }),
        makeForecastPeriod({ name: 'Tonight' }),
      ],
    });
    const forecast = new Forecast(data);
    expect(forecast.periods).toHaveLength(3);
    expect(forecast.periods.map((p) => p.name)).toEqual(['Saturday', 'Today', 'Tonight']);
  });

  it('creates an empty periods array from empty data', () => {
    const data = makeForecastData({ periods: [] });
    const forecast = new Forecast(data);
    expect(forecast.periods).toEqual([]);
  });
});
