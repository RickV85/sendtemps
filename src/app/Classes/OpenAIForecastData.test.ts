import { makeForecastData, makeForecastPeriod } from '@/test/factories';

import { Forecast } from './Forecast';
import { OpenAIForecastData } from './OpenAIForecastData';

describe('OpenAIForecastData', () => {
  it('sets sport and creates forecast periods with name and detailedForecast', () => {
    const forecastData = makeForecastData({
      periods: [
        makeForecastPeriod({ detailedForecast: 'Clear night.', name: 'Tonight' }),
        makeForecastPeriod({ detailedForecast: 'Sunny skies.', name: 'Today' }),
      ],
    });
    const forecast = new Forecast(forecastData);
    const aiData = new OpenAIForecastData('climb', forecast);
    expect(aiData.sport).toBe('climb');
    expect(aiData.forecastPeriods).toEqual([
      { detailedForecast: 'Clear night.', name: 'Tonight' },
      { detailedForecast: 'Sunny skies.', name: 'Today' },
    ]);
  });

  it('creates empty periods from empty forecast', () => {
    const forecastData = makeForecastData({ periods: [] });
    const forecast = new Forecast(forecastData);
    const aiData = new OpenAIForecastData('ski', forecast);
    expect(aiData.forecastPeriods).toEqual([]);
  });
});
