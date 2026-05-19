describe('initial display for an authorized user', () => {
  describe('default load', () => {
    beforeEach(() => {
      cy.stubAuthedFetches();

      cy.visit('/');
      cy.injectAxe();
    });

    it('should have no accessibility violations', () => {
      cy.get('div.home-welcome-msg-div', { timeout: 10000 }).should('be.visible');
      cy.checkA11y();
    });

    it('should show the Edit Locations button to an authorized user', () => {
      cy.get('#navLocationBtn').should('have.text', 'Edit Locations');
    });

    it('should not display a Sign In button', () => {
      cy.get('#navLocationBtn').should('have.text', 'Edit Locations');
      cy.get('button.user-profile-login-button').should('not.exist');
    });

    it("should show the user's profile info display and have an option to sign out", () => {
      cy.get('div.user-profile-div').as('userProfile');
      cy.get('@userProfile').contains('Rick Vermeil');
      cy.get('@userProfile')
        .find('a')
        .should('be.visible')
        .should('have.attr', 'href', '/api/auth/signout')
        .should('have.text', 'Sign Out')
        .click();

      cy.location('pathname').should('equal', '/api/auth/signout');
    });

    it("should display the site title, 'SendTemps'", () => {
      cy.get('h1').should('have.text', 'SendTemps');
    });

    it("should display the type-select input and default to 'Select location type'", () => {
      cy.get('select.type-select')
        .find('option:selected')
        .should('have.text', 'Select location type');
    });

    it('should display the Welcome Message once loaded', () => {
      cy.get('section.forecast-section')
        .find('div.home-welcome-msg-div>h2')
        .should('have.text', 'Welcome to SendTemps!');
    });

    it('should show the proper Welcome Message tailored to authorized user', () => {
      cy.get('span[data-testid="authed-edit-location-msg"]').should('be.visible');
    });
  });

  describe('while session response is delayed', () => {
    beforeEach(() => {
      cy.stubAuthedFetches({ sessionDelayMs: 900 });

      cy.visit('/');
      cy.injectAxe();
    });

    it('should display an initial loading message', () => {
      cy.get('body')
        .find('div.loading-msg-div', { timeout: 5000 })
        .should('exist')
        .should('have.text', 'Please wait, loading...');
    });
  });
});
