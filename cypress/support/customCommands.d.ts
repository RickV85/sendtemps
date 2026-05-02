/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    stubAuthedFetches(): Chainable;
    stubAuthedSession(): Chainable;
    stubForecastFetches(): Chainable;
    stubSession(): Chainable;
    waitForAddLocationGoogleMapReady(): Chainable;
  }
}
