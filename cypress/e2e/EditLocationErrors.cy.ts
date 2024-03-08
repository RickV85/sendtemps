describe("Edit Location errors", () => {
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

    // Intercept user location req
    cy.intercept("/api/user_locations?user_id=101000928729222042760", {
      fixture: "user_locs.json",
    });

    // Intercept default locations req
    cy.intercept("GET", "/api/default_locations", {
      fixture: "default_locs.json",
    });

    cy.visit("/edit-locations");
  });

  it("should show an error on failed deletion", () => {
    cy.intercept("DELETE", "/api/user_locations", {
      statusCode: 500,
      body: "Error",
    });

    cy.get("select#editUserLocSelect").select(1);
    cy.get("button#userLocDeleteBtn").as("deleteBtn");
    cy.get("@deleteBtn").click();

    cy.get("dialog#userLocModal")
      .find("button")
      .eq(1)
      .should("have.text", "Confirm")
      .click();

    cy.get("dialog#userLocModal")
      .find("p")
      .eq(0)
      .should(
        "have.text",
        "An error occurred while deleting location. Please try again."
      );
  });

  // Need to add tests for failed name change and type PATCH requests
  // Might need to add a .catch() and move the else() functions lines 57-63
  // in EditUserLocModal - handlePatchRequest lines to trigger error messaging
});
