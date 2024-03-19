describe("home error testing for unauthorized user", () => {
  beforeEach(() => {
    // Intercept and return empty object for unauthorized user
    cy.intercept("/api/auth/session", JSON.stringify({}));
  });

  it("should show error message and reload button when default location call fails", () => {
    // Failure - default locations call
    cy.intercept("/api/default_locations", {
      statusCode: 500,
    });

    cy.visit("/");

    cy.wait(2500);

    cy.get("section.forecast-section")
      .find("p.error-msg")
      .should("be.visible")
      .should(
        "have.text",
        "Oh, no! An error occurred while fetching locations. Please reload the page and try again."
      );

    cy.get("section.forecast-section")
      .find("button.reload-btn")
      .should("be.visible");
  });
});

describe("home error testing for authorized user", () => {
  beforeEach(() => {
    // Intercept and return user session object
    cy.intercept("/api/auth/session", {
      fixture: "session.json",
    });

    // Intercept user login patch req
    cy.intercept(
      "/api/users",
      JSON.stringify(
        "New user data for id: 101000928729222042760 matches previous user data from database. New login: 2024-02-25T17:35:44.233Z"
      )
    );
  });

  it("should show error message and reload button when default location call fails", () => {
    // Failure - default locations call
    cy.intercept("/api/default_locations", {
      statusCode: 500,
    });

    // Intercept user locations call
    cy.intercept("/api/user_locations?user_id=101000928729222042760", {
      fixture: "user_locs.json",
    });

    cy.visit("/");

    cy.wait(2500);

    cy.get("section.forecast-section")
      .find("p.error-msg")
      .should("be.visible")
      .should(
        "have.text",
        "Oh, no! An error occurred while fetching locations. Please reload the page and try again."
      );

    cy.get("section.forecast-section")
      .find("button.reload-btn")
      .should("be.visible");
  });

  it("should show error msg when user_locations call fails", () => {
    // Failure - user locations call
    cy.intercept("/api/user_locations?user_id=101000928729222042760", {
      statusCode: 500,
    });

    // INtercept default locations call
    cy.intercept("/api/default_locations", {
      fixture: "default_locs.json",
    });

    cy.visit("/");

    cy.wait(1000);

    cy.get("section.forecast-section")
      .find("p.error-msg")
      .should("be.visible")
      .should(
        "have.text",
        "Oh, no! An error occurred while fetching locations. Please reload the page and try again."
      );

    cy.get("section.forecast-section")
      .find("button.reload-btn")
      .should("be.visible");
  });
});
