describe('home error testing for unauthorized user', () => {
  beforeEach(() => {
    cy.intercept('/api/auth/session', JSON.stringify({})).as('session');
  });

  it('should show error message and reload button when default location call fails', () => {
    cy.intercept('/api/default_locations', { statusCode: 500 }).as('defaultLocationsFail');

    cy.visit('/');
    cy.injectAxe();

    cy.get('section.forecast-section')
      .find('p.error-msg', { timeout: 10000 })
      .should('be.visible')
      .should(
        'have.text',
        'Oh, no! An error occurred while fetching locations. Please reload the page and try again.',
      );

    cy.get('section.forecast-section').find('button.reload-btn').should('be.visible');
  });
});

describe('home error testing for authorized user', () => {
  beforeEach(() => {
    cy.stubAuthedSession();
  });

  it('should show error message and reload button when default location call fails', () => {
    cy.intercept('/api/default_locations', { statusCode: 500 }).as('defaultLocationsFail');
    cy.intercept('/api/user_locations?user_id=101000928729222042760', {
      fixture: 'user_locs.json',
    }).as('userLocations');

    cy.visit('/');
    cy.injectAxe();

    cy.get('section.forecast-section')
      .find('p.error-msg', { timeout: 10000 })
      .should('be.visible')
      .should(
        'have.text',
        'Oh, no! An error occurred while fetching locations. Please reload the page and try again.',
      );

    cy.get('section.forecast-section').find('button.reload-btn').should('be.visible');
  });

  it('should show error msg when user_locations call fails', () => {
    cy.intercept('/api/default_locations', { fixture: 'default_locs.json' }).as('defaultLocations');
    cy.intercept('/api/user_locations?user_id=101000928729222042760', {
      statusCode: 500,
    }).as('userLocationsFail');

    cy.visit('/');
    cy.injectAxe();

    cy.get('section.forecast-section')
      .find('p.error-msg', { timeout: 10000 })
      .should('be.visible')
      .should(
        'have.text',
        'Oh, no! An error occurred while fetching locations. Please reload the page and try again.',
      );

    cy.get('section.forecast-section').find('button.reload-btn').should('be.visible');
  });
});
