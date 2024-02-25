describe("initial display for an unauthorized user", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    // Intercept and return user session object
    cy.intercept("http://localhost:3000/api/auth/session", {
      fixture: "session.json",
    });

    // Intercept user login patch req
    cy.intercept(
      "http://localhost:3000/api/users",
      "New user data for id: 101000928729222042760 matches previous user data from database. New login: 2024-02-25T17:35:44.233Z"
    );

    // Intercept user location req
    cy.intercept(
      "http://localhost:3000/api/user_locations?user_id=101000928729222042760",
      { fixture: "user_locs.json" }
    );

    // Intercept def_locs api call
    cy.intercept("http://localhost:3000/api/default_locations", {
      fixture: "default_locs.json",
    });
  });

  it("should display an initial loading message", () => {
    cy.get("div.home-loading-msg").should(
      "have.text",
      "Please wait, loading..."
    );
  });

  it("should display the Welcome Message once loaded", () => {
    cy.wait(500);
    cy.get("section.forecast-section")
      .find("div.home-welcome-msg-div>h2")
      .should("have.text", "Welcome to SendTemps!");
  });

  it("should display the site title, 'SendTemps'", () => {
    cy.get("h1").should("have.text", "SendTemps");
  });

  it("should display the type-select input and default to 'Select Sport'", () => {
    cy.get("select.type-select")
      .find("option:selected")
      .should("have.text", "Select Sport");
  });

  it("should show the Edit Locations button to an authorized user", () => {
    cy.get("nav.home-nav")
      .find("button#navLocationBtn")
      .should("have.text", "Edit Locations");
  });

  it("should not display a Sign In button", () => {
    cy.get("button.user-profile-login-button").should("not.exist");
  });

  // Add test for session display here

  it("should show the proper Welcome Message tailored to authorized user", () => {
    cy.get("div.home-welcome-msg-div").contains(
      "Click the “Edit Locations” button in the upper left corner to add a new custom location or edit an existing custom location."
    );
  });
});
