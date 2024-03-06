describe("Edit locations display", () => {
  beforeEach(() => {
    // Intercept and return user session object
    cy.intercept("/api/auth/session", {
      fixture: "session.json",
    });

    // Intercept user login patch req
    cy.intercept(
      "/api/users",
      "New user data for id: 101000928729222042760 matches previous user data from database. New login: 2024-02-25T17:35:44.233Z"
    );

    // Intercept user location req
    cy.intercept("/api/user_locations?user_id=101000928729222042760", {
      fixture: "user_locs.json",
    });

    // Intercept default locations req
    cy.intercept("/api/default_locations", {
      fixture: "default_locs.json",
    });

    cy.visit("/edit-locations");

    cy.wait(250);
  });

  it("should pass", () => {
    cy.get("body").should("exist");
  });
});
