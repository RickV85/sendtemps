describe("initial display for an unauthorized user", () => {
  beforeEach(() => {
    // Intercept and return empty object for unauthorized user
    cy.intercept("/api/auth/session", {});

    // Intercept default locations req
    cy.intercept("/api/default_locations", {
      fixture: "default_locs.json",
    });

    cy.visit("/");
  });

  it("should display an initial loading message", { retries: 10 }, () => {
    cy.get("body")
      .find("div.loading-msg-div", { timeout: 1500 })
      .should("exist")
      .should("have.text", "Please wait, loading...");
  });

  it("should display a Sign In button", () => {
    cy.get("button.user-profile-login-button").should("have.text", "Sign in!");
  });

  it("should display the site title, 'SendTemps'", () => {
    cy.get("h1").should("have.text", "SendTemps");
  });

  it("should display the type-select input and default to 'Select location type'", () => {
    cy.get("select.type-select")
      .find("option:selected")
      .should("have.text", "Select location type");
  });

  it("should display the Welcome Message once loaded", () => {
    cy.wait(250);
    cy.get("section.forecast-section")
      .find("div.home-welcome-msg-div>h2")
      .should("have.text", "Welcome to SendTemps!");
  });

  it("should show the proper Welcome Message tailored to unauthorized user", () => {
    cy.wait(250);
    cy.get("div.home-welcome-msg-div").contains(
      "Log in with Google by clicking the “Sign in!” button in the upper right corner to add your own favorite locations!"
    );
  });

  it("should allow a user to sign in with Google", () => {
    cy.get("button.user-profile-login-button").click();
    cy.wait(250);
    cy.location("pathname").should("equal", "/api/auth/signin");
  });
});
