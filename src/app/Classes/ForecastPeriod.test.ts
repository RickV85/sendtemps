import { makeForecastPeriod } from '@/test/factories';

import { ForecastPeriod } from './ForecastPeriod';

describe('ForecastPeriod', () => {
  it('assigns all properties from raw period data', () => {
    const raw = makeForecastPeriod({
      detailedForecast: 'Sunny skies.',
      endTime: '2024-06-15T18:00:00-04:00',
      icon: 'https://example.com/icon.png',
      name: 'Today',
      relativeHumidity: { unitCode: 'wmoUnit:percent', value: 55 },
      startTime: '2024-06-15T06:00:00-04:00',
    });
    const period = new ForecastPeriod(raw);
    expect(period.detailedForecast).toBe('Sunny skies.');
    expect(period.endTime).toBe('2024-06-15T18:00:00-04:00');
    expect(period.icon).toBe('https://example.com/icon.png');
    expect(period.name).toBe('Today');
    expect(period.relativeHumidity.value).toBe(55);
    expect(period.startTime).toBe('2024-06-15T06:00:00-04:00');
  });
});
