describe('daily forecast display errors', () => {
  beforeEach(() => {
    cy.stubSession();

    cy.visit('/');
    cy.injectAxe();

    cy.get('select.type-select').select('Climbing');
  });

  it('should display an error message when grid location call fails', () => {
    cy.intercept('https://api.weather.gov/points/40.004482,-105.355800', {
      statusCode: 500,
    }).as('gridLocationFail');

    cy.intercept('https://api.weather.gov/points/40.0045,-105.3558', {
      statusCode: 500,
    }).as('gridLocationRedirectFail');

    cy.get('select.location-select').select('Boulder Canyon - Lower');

    cy.get('p.error-msg', { timeout: 30000 }).should(
      'have.text',
      'Oh, no! All attempts to fetch NOAA grid location failed for coordinates: 40.004482,-105.355800. Please reload the page and try again.',
    );
  });

  it('should display an error message when daily forecast fetch fails', () => {
    cy.intercept('https://api.weather.gov/points/40.004482,-105.355800', {
      fixture: 'location_details.json',
    }).as('gridLocation');

    cy.intercept('https://api.weather.gov/points/40.0045,-105.3558', {
      fixture: 'location_details.json',
    }).as('gridLocationRedirect');

    cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast', {
      statusCode: 500,
    }).as('dailyForecastFail');

    cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast/hourly', {
      fixture: 'hourly_forecast.json',
    }).as('hourlyForecast');

    cy.intercept('/api/open_ai/send_score', { fixture: 'sendscore.json' }).as('sendScore');

    cy.get('select.location-select').select('Boulder Canyon - Lower');

    cy.get('p.error-msg', { timeout: 30000 }).should(
      'have.text',
      'Oh, no! All daily forecast fetch attempts failed. Please reload the page and try again.',
    );
  });

  it('should display an error message when hourly forecast fetch fails', () => {
    cy.intercept('https://api.weather.gov/points/40.004482,-105.355800', {
      fixture: 'location_details.json',
    }).as('gridLocation');

    cy.intercept('https://api.weather.gov/points/40.0045,-105.3558', {
      fixture: 'location_details.json',
    }).as('gridLocationRedirect');

    cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast', {
      fixture: 'detailed_forecast.json',
    }).as('dailyForecast');

    cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast/hourly', {
      statusCode: 500,
    }).as('hourlyForecastFail');

    cy.intercept('/api/open_ai/send_score', { fixture: 'sendscore.json' }).as('sendScore');

    cy.get('select.location-select').select('Boulder Canyon - Lower');

    cy.get('p.error-msg', { timeout: 30000 }).should(
      'have.text',
      'Oh, no! All hourly forecast fetch attempts failed. Please reload the page and try again.',
    );
  });

  it('should display an error when the OpenAI fetch fails', () => {
    cy.intercept('https://api.weather.gov/points/40.004482,-105.355800', {
      fixture: 'location_details.json',
    }).as('gridLocation');

    cy.intercept('https://api.weather.gov/points/40.0045,-105.3558', {
      fixture: 'location_details.json',
    }).as('gridLocationRedirect');

    cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast', {
      fixture: 'detailed_forecast.json',
    }).as('dailyForecast');

    cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast/hourly', {
      fixture: 'hourly_forecast.json',
    }).as('hourlyForecast');

    cy.intercept('/api/open_ai/send_score', { statusCode: 500 }).as('sendScoreFail');

    cy.get('select.location-select').select('Boulder Canyon - Lower');

    cy.get('p.error-msg').should(
      'have.text',
      'Oh, no! An error occurred while creating SendScores.',
    );
  });
});
