describe('AddLocForm happy path', () => {
  beforeEach(() => {
    cy.stubAuthedFetches();

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    cy.intercept('POST', '/api/user_locations', {
      body: JSON.stringify('Success: New user location created for user_id: 101000928729222042760'),
      statusCode: 201,
    }).as('postUserLocation');

    cy.visit('/edit-locations');
    cy.injectAxe();
  });

  it('should display the add location section with map instructions', () => {
    cy.get('h2#addLocTitle').should('have.text', 'Add New Location');
    cy.get('section.add-loc-section')
      .find('p')
      .should(
        'have.text',
        'Scroll down to view entire map below, then click on the map where you would like to create a new location.',
      );
  });

  it('should show the add location form after clicking the map and submit successfully', () => {
    cy.waitForAddLocationGoogleMapReady();

    cy.get('div.map-container [role="application"]').click(200, 200);

    cy.get('form.add-loc-form', { timeout: 10000 }).should('be.visible');

    cy.get('#addLocNameInput').type('Test Location');
    cy.get('select[aria-label="Select location type for your new custom location"]').select(
      'Climbing',
    );

    cy.get('form.add-loc-form').contains('button', 'Save').click();

    cy.wait('@postUserLocation');
    cy.get('#submitMessage').should('have.text', 'New location saved!');
  });

  it('should show validation error when name is empty', () => {
    cy.waitForAddLocationGoogleMapReady();

    cy.get('div.map-container [role="application"]').click(200, 200);

    cy.get('form.add-loc-form', { timeout: 10000 }).should('be.visible');

    cy.get('select[aria-label="Select location type for your new custom location"]').select(
      'Climbing',
    );
    cy.get('form.add-loc-form').contains('button', 'Save').click();

    cy.get('#submitMessage').should('have.text', 'Please enter a name for your new location.');
  });

  it('should show validation error when name exceeds 50 characters', () => {
    cy.waitForAddLocationGoogleMapReady();

    cy.get('div.map-container [role="application"]').click(200, 200);

    cy.get('form.add-loc-form', { timeout: 10000 }).should('be.visible');

    cy.get('#addLocNameInput').type(
      'This name is way too long and exceeds the fifty character limit easily',
    );
    cy.get('select[aria-label="Select location type for your new custom location"]').select(
      'Climbing',
    );
    cy.get('form.add-loc-form').contains('button', 'Save').click();

    cy.get('#submitMessage').should(
      'have.text',
      'Location names cannot be longer than 50 characters.',
    );
  });

  it('should show validation error when no type is selected', () => {
    cy.waitForAddLocationGoogleMapReady();

    cy.get('div.map-container [role="application"]').click(200, 200);

    cy.get('form.add-loc-form', { timeout: 10000 }).should('be.visible');

    cy.get('#addLocNameInput').type('Test Location');
    cy.get('form.add-loc-form').contains('button', 'Save').click();

    cy.get('#submitMessage').should('have.text', 'Please select a type for this location.');
  });

  it('should cancel and remove form when Cancel is clicked', () => {
    cy.waitForAddLocationGoogleMapReady();

    cy.get('div.map-container [role="application"]').click(200, 200);

    cy.get('form.add-loc-form', { timeout: 10000 }).should('be.visible');

    cy.get('form.add-loc-form').contains('button', 'Cancel').click();

    cy.get('form.add-loc-form').should('not.exist');
    cy.get('section.add-loc-section')
      .find('p')
      .should(
        'have.text',
        'Scroll down to view entire map below, then click on the map where you would like to create a new location.',
      );
  });

  it('should have no accessibility violations', () => {
    cy.get('h2#addLocTitle').should('be.visible');
    cy.checkA11y();
  });
});
