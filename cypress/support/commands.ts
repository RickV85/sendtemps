export {};

Cypress.Commands.add('stubAuthedFetches', (options?: { sessionDelayMs?: number }) => {
  cy.stubAuthedSession(options?.sessionDelayMs);
  cy.intercept('/api/default_locations', { fixture: 'default_locs.json' }).as('defaultLocations');
  cy.intercept('/api/user_locations?user_id=101000928729222042760', {
    fixture: 'user_locs.json',
  }).as('userLocations');
});

Cypress.Commands.add('stubAuthedSession', (sessionDelayMs?: number) => {
  const sessionResponse =
    sessionDelayMs != null && sessionDelayMs > 0
      ? { delay: sessionDelayMs, fixture: 'session.json' as const }
      : { fixture: 'session.json' as const };
  cy.intercept('/api/auth/session', sessionResponse).as('session');
  cy.intercept(
    '/api/users',
    JSON.stringify(
      'New user data for id: 101000928729222042760 matches previous user data from database. New login: 2024-02-25T17:35:44.233Z',
    ),
  ).as('users');
});

Cypress.Commands.add('stubForecastFetches', () => {
  cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast', {
    fixture: 'detailed_forecast.json',
  }).as('dailyForecast');
  cy.intercept('https://api.weather.gov/points/40.004482,-105.355800', {
    fixture: 'location_details.json',
  }).as('gridLocation');
  cy.intercept('https://api.weather.gov/gridpoints/BOU/51,74/forecast/hourly', {
    fixture: 'hourly_forecast.json',
  }).as('hourlyForecast');
  cy.intercept('/api/open_ai/send_score', { fixture: 'sendscore.json' }).as('sendScore');
});

Cypress.Commands.add('stubSession', () => {
  cy.intercept('/api/default_locations', { fixture: 'default_locs.json' }).as('defaultLocations');
  cy.intercept('/api/auth/session', JSON.stringify({})).as('session');
});

Cypress.Commands.add('waitForAddLocationGoogleMapReady', () => {
  cy.get('div.map-container').scrollIntoView();
  cy.get('div.map-container [data-google-map-loaded="true"][role="application"]', {
    timeout: 20000,
  }).should('be.visible');
});
