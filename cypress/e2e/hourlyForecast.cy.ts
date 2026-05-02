import { axeRunOptionsDisableColorContrast } from 'cypress/support/axeChecks';

describe('hourly forecast display', () => {
  beforeEach(() => {
    cy.stubSession();
    cy.stubForecastFetches();

    cy.visit('/');
    cy.injectAxe();

    cy.get('select.type-select').select('Climbing');
    cy.get('select.location-select').select('Boulder Canyon - Lower');
    cy.get('div.detailed-day-forecast').eq(0).click();
    cy.get('div.hourly-forecast-container').find('article').eq(0).as('hourlyTile');
  });

  it('should have no accessibility violations', () => {
    cy.checkA11y(undefined, axeRunOptionsDisableColorContrast);
  });

  it('should display the time period name', () => {
    cy.get('header.hourly-forecast-header > h2').should('have.text', 'Today');
  });

  it('should display a time for each time period', () => {
    cy.get('@hourlyTile').find('h3').should('have.text', '10:00 AM');
  });

  it('should display the temperature and conditions', () => {
    cy.get('@hourlyTile').find('div').eq(1).contains('50 °F');
    cy.get('@hourlyTile').find('div').eq(1).contains('Sunny');
  });

  it('should display the chance of precipitation', () => {
    cy.get('@hourlyTile').find('div').eq(2).contains('0%');
    cy.get('@hourlyTile').find('div').eq(2).contains('Precip.');
  });

  it('should display the wind conditions', () => {
    cy.get('@hourlyTile').find('div').eq(3).contains('31 mph');
    cy.get('@hourlyTile').find('div').eq(3).contains('W');
  });

  it('should display the relative humidity', () => {
    cy.get('@hourlyTile').find('div').eq(4).contains('17%');
    cy.get('@hourlyTile').find('div').eq(4).contains('RH');
  });

  it('should allow you to return to the daily forecast view', () => {
    cy.get('button.hourly-close-btn').click();

    cy.get('div.hourly-forecast-container').should('not.exist');
    cy.get('div.detailed-day-forecast').eq(0).should('be.visible');
  });
});
