import { makeHourlyForecastPeriod } from '@/test/factories';

import { HourlyForecastPeriod } from './HourlyForecastPeriod';

describe('HourlyForecastPeriod', () => {
  it('assigns all properties from raw data', () => {
    const raw = makeHourlyForecastPeriod({
      endTime: '2024-06-15T07:00:00-04:00',
      probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 15 },
      relativeHumidity: { unitCode: 'wmoUnit:percent', value: 55 },
      shortForecast: 'Sunny',
      startTime: '2024-06-15T06:00:00-04:00',
      temperature: 72,
      windDirection: 'NW',
      windSpeed: '10 mph',
    });
    const period = new HourlyForecastPeriod(raw);
    expect(period).toBeInstanceOf(HourlyForecastPeriod);
    expect(period.conditions).toBe('Sunny');
    expect(period.endTime).toBe('2024-06-15T07:00:00-04:00');
    expect(period.humidity).toBe(55);
    expect(period.precip).toBe(15);
    expect(period.startTime).toBe('2024-06-15T06:00:00-04:00');
    expect(period.temp).toBe(72);
    expect(period.wind).toEqual({ direction: 'NW', speed: '10 mph' });
  });

  it('handles null precipitation value', () => {
    const raw = makeHourlyForecastPeriod({
      probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: null },
    });
    const period = new HourlyForecastPeriod(raw);
    expect(period.precip).toBeNull();
  });

  describe('createFormattedTime', () => {
    it('returns a formatted time string matching H:MM AM/PM pattern', () => {
      const raw = makeHourlyForecastPeriod({
        startTime: '2024-06-15T14:00:00Z',
      });
      const period = new HourlyForecastPeriod(raw);
      expect(period.time).toEqual('8:00 AM');
    });
  });
});
