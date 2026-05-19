describe('Current Location forecast flow', () => {
  beforeEach(() => {
    cy.stubSession();
    cy.stubForecastFetches();

    cy.intercept('https://api.weather.gov/points/39.7392,-104.9903', {
      fixture: 'location_details.json',
    }).as('currentGridLocation');

    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
          success({
            coords: {
              latitude: 39.7392,
              longitude: -104.9903,
            },
          } as GeolocationPosition);
        });
      },
    });
    cy.injectAxe();
  });

  it('should fetch and display forecast when Current Location is selected', () => {
    cy.get('select.type-select').select('Current Location');

    cy.wait('@currentGridLocation');

    cy.get('div.detailed-day-forecast', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('div.detailed-day-forecast').eq(0).find('h2').should('have.text', 'Today');
  });

  it('should not show SendScore summary for Current Location', () => {
    cy.get('select.type-select').select('Current Location');

    cy.get('div.detailed-day-forecast', { timeout: 10000 }).should('have.length.at.least', 1);

    cy.get('div.send-score-summary.loading').should('not.exist');
    cy.get('div.send-score-summary').should('not.exist');
  });

  it('should display hourly forecast when a day tile is clicked', () => {
    cy.get('select.type-select').select('Current Location');

    cy.get('div.detailed-day-forecast', { timeout: 10000 }).eq(0).click();

    cy.get('div.hourly-forecast-container').should('be.visible');
    cy.get('header.hourly-forecast-header > h2').should('have.text', 'Today');
  });

  it('should have no accessibility violations', () => {
    cy.get('select.type-select').select('Current Location');
    cy.get('div.detailed-day-forecast', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.checkA11y();
  });
});
