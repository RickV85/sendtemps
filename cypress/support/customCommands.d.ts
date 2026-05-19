/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    stubAuthedFetches(options?: { sessionDelayMs?: number }): Chainable;
    stubAuthedSession(sessionDelayMs?: number): Chainable;
    stubForecastFetches(): Chainable;
    stubSession(): Chainable;
    waitForAddLocationGoogleMapReady(): Chainable;
  }
}
