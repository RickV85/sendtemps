describe("initial display for an unauthorized user", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    // Intercept and return empty object for unauthorized user
    cy.intercept("http://localhost:3000/api/auth/session", {});

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

  it("should display a Sign In button", () => {
    cy.get("button.user-profile-login-button").should("have.text", "Sign in!");
  });

  it("should show the proper Welcome Message tailored to unauthorized user", () => {
    cy.get("div.home-welcome-msg-div").contains(
      "Log in with Google by clicking the “Sign in!” button in the upper right corner to add your own favorite locations!"
    );
  });
});
