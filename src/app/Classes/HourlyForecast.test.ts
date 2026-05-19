import type { HourlyForecastParams } from '@/app/Interfaces/interfaces';
import { makeHourlyForecastData, makeHourlyForecastPeriod } from '@/test/factories';

import { HourlyForecast } from './HourlyForecast';

describe('HourlyForecast', () => {
  const data = makeHourlyForecastData();

  describe('constructor', () => {
    it('creates HourlyForecastPeriod instances from data', () => {
      const forecast = new HourlyForecast(data);
      expect(forecast).toBeInstanceOf(HourlyForecast);
      expect(forecast.hourlyPeriods).toHaveLength(12);
    });
  });

  describe('filterHourlyPeriodsByTime', () => {
    const forecast = new HourlyForecast(data);

    it('returns periods within the time range (inclusive start, exclusive end)', () => {
      const params: HourlyForecastParams = {
        end: '2024-06-15T10:00:00-04:00',
        name: 'Morning',
        start: '2024-06-15T06:00:00-04:00',
      };
      const result = forecast.filterHourlyPeriodsByTime(params);
      expect(result).toHaveLength(4);
    });

    it('returns empty array when no periods match', () => {
      const params: HourlyForecastParams = {
        end: '2024-06-16T06:00:00-04:00',
        name: 'Late Night',
        start: '2024-06-16T00:00:00-04:00',
      };
      const result = forecast.filterHourlyPeriodsByTime(params);
      expect(result).toHaveLength(0);
    });

    it('excludes the end boundary', () => {
      const params: HourlyForecastParams = {
        end: '2024-06-15T07:00:00-04:00',
        name: 'Single Hour',
        start: '2024-06-15T06:00:00-04:00',
      };
      const result = forecast.filterHourlyPeriodsByTime(params);
      expect(result).toHaveLength(1);
    });
  });

  describe('getMinMaxRHForTimePeriod', () => {
    it('returns min and max relative humidity for the time range', () => {
      const customData = makeHourlyForecastData({
        periods: [
          makeHourlyForecastPeriod({
            endTime: '2024-06-15T07:00:00-04:00',
            relativeHumidity: { unitCode: 'wmoUnit:percent', value: 40 },
            startTime: '2024-06-15T06:00:00-04:00',
          }),
          makeHourlyForecastPeriod({
            endTime: '2024-06-15T08:00:00-04:00',
            relativeHumidity: { unitCode: 'wmoUnit:percent', value: 80 },
            startTime: '2024-06-15T07:00:00-04:00',
          }),
          makeHourlyForecastPeriod({
            endTime: '2024-06-15T09:00:00-04:00',
            relativeHumidity: { unitCode: 'wmoUnit:percent', value: 60 },
            startTime: '2024-06-15T08:00:00-04:00',
          }),
        ],
      });
      const forecast = new HourlyForecast(customData);
      const params: HourlyForecastParams = {
        end: '2024-06-15T09:00:00-04:00',
        name: 'Morning',
        start: '2024-06-15T06:00:00-04:00',
      };
      expect(forecast.getMinMaxRHForTimePeriod(params)).toEqual({ max: 80, min: 40 });
    });
  });
});
