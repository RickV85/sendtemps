import { axeRunOptionsDisableColorContrast } from 'cypress/support/axeChecks';

describe('mobile viewport - home page', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.stubSession();

    cy.visit('/');
    cy.injectAxe();
  });

  it('should display the site title', () => {
    cy.get('h1').should('have.text', 'SendTemps');
  });

  it('should display the type-select dropdown', () => {
    cy.get('select.type-select').should('be.visible');
  });

  it('should display the Welcome Message', () => {
    cy.get('div.home-welcome-msg-div>h2').should('have.text', 'Welcome to SendTemps!');
  });

  it('should display a Sign In button', () => {
    cy.get('button.user-profile-login-button').should('be.visible');
  });

  it('should have no accessibility violations', () => {
    cy.get('div.home-welcome-msg-div', { timeout: 10000 }).should('be.visible');
    // Disable for select that is transparent
    cy.checkA11y(undefined, axeRunOptionsDisableColorContrast);
  });
});

describe('mobile viewport - home page with forecast', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.stubSession();
    cy.stubForecastFetches();

    cy.visit('/');
    cy.injectAxe();
  });

  it('should display daily forecast on mobile', () => {
    cy.get('select.type-select').select('Climbing');
    cy.get('select.location-select').select('Boulder Canyon - Lower');

    cy.get('div.detailed-day-forecast', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('div.detailed-day-forecast').eq(0).find('h2').should('have.text', 'Today');
  });

  it('should display hourly forecast when a day tile is tapped', () => {
    cy.get('select.type-select').select('Climbing');
    cy.get('select.location-select').select('Boulder Canyon - Lower');

    cy.get('div.detailed-day-forecast', { timeout: 10000 }).eq(0).click();

    cy.get('div.hourly-forecast-container').should('be.visible');
  });
});

describe('mobile viewport - edit locations page', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.stubAuthedFetches();

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.visit('/');
    cy.injectAxe();

    cy.get('button#navLocationBtn').click();
    cy.location('pathname').should('equal', '/edit-locations');
  });

  it('should display the edit custom locations heading', () => {
    cy.get('h2').eq(0).should('have.text', 'Edit Custom Locations');
  });

  it('should display the user location select', () => {
    cy.get('select#editUserLocSelect').should('be.visible');
  });

  it('should display the Back button', () => {
    cy.get('button#editLocBackBtn').should('be.visible').should('have.text', 'Back');
  });

  it('should have no accessibility violations', () => {
    cy.get('h2').eq(0).should('have.text', 'Edit Custom Locations');
    cy.checkA11y(undefined, axeRunOptionsDisableColorContrast);
  });
});
