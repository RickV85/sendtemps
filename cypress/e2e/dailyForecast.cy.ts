describe('daily forecast display', () => {
  beforeEach(() => {
    cy.stubSession();
    cy.stubForecastFetches();

    cy.visit('/');
    cy.injectAxe();

    cy.get('select.type-select').select('Climbing');
    cy.get('select.location-select').select('Boulder Canyon - Lower');
    cy.get('div.detailed-day-forecast').eq(0).as('todayForecast');
  });

  it('should have no accessibility violations', () => {
    cy.checkA11y();
  });

  it('should display the detailed daily forecast when a location is selected', () => {
    cy.get('@todayForecast').find('h2').should('have.text', 'Today');
    cy.get('@todayForecast')
      .find('p.day-forecast-text')
      .should(
        'have.text',
        'Sunny. High near 57, with temperatures falling to around 52 in the afternoon. West wind 30 to 36 mph, with gusts as high as 54 mph. Humidity 19% to 17% RH.',
      );
  });

  it('should display a summary from AI data', () => {
    cy.get('div.send-score-summary').should(
      'have.text',
      'Thursday is the best day for rock climbing with sunny skies, a high near 51°F, and light west winds. Friday is also a good option with a high near 61°F and light southwest winds. Saturday could work as well with a high near 59°F and mostly clear skies.',
    );
  });

  it('should display the SendScore on forecast tiles', () => {
    cy.get('div.detailed-day-forecast')
      .eq(1)
      .as('tonightForecast')
      .find('div.day-send-score-div>p')
      .should('have.text', 'SendScore:1');
  });

  it('should display a tip to click on forecast tiles for hourly forecasts', () => {
    cy.get('p.hour-forecast-tip').should('be.visible');
  });
});
