describe("initial display for an authorized user", () => {
  beforeEach(() => {
    // Unregister service worker
    cy.window().then(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
    });

    // Clear cookies and storage
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();

    // Clear cache
    if (window.caches) {
      cy.window().then((win) => {
        win.caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            win.caches.delete(cacheName);
          });
        });
      });
    }

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

    // Intercept default locations req
    cy.intercept("http://localhost:3000/api/default_locations", {
      fixture: "default_locs.json",
    });
  });

  it("should display an initial loading message", { retries: 10 }, () => {
    cy.get("body")
      .find("div.home-loading-msg", { timeout: 1500 })
      .should("exist")
      .should("have.text", "Please wait, loading...");
  });

  it("should show the Edit Locations button to an authorized user", () => {
    cy.get("nav.home-nav")
      .find("button#navLocationBtn")
      .should("have.text", "Edit Locations");
  });

  it("should not display a Sign In button", () => {
    cy.get("button.user-profile-login-button").should("not.exist");
  });

  it("should show the user's profile info display", () => {
    cy.get("div.user-profile-div").as("userProfile");
    cy.get("@userProfile").contains("Rick Vermeil");
    cy.get("@userProfile")
      .find("a")
      .should("be.visible")
      .should("have.attr", "href", "/api/auth/signout");
  });

  it("should display the site title, 'SendTemps'", () => {
    cy.get("h1").should("have.text", "SendTemps");
  });

  it("should display the type-select input and default to 'Select Sport'", () => {
    cy.get("select.type-select")
      .find("option:selected")
      .should("have.text", "Select Sport");
  });

  it("should display the Welcome Message once loaded", () => {
    cy.wait(250);
    cy.get("section.forecast-section")
      .find("div.home-welcome-msg-div>h2")
      .should("have.text", "Welcome to SendTemps!");
  });

  it("should show the proper Welcome Message tailored to authorized user", () => {
    cy.wait(250);
    cy.get("div.home-welcome-msg-div").contains(
      "Click the “Edit Locations” button in the upper left corner to add a new custom location or edit an existing custom location."
    );
  });

  // Error testing

  it("should show error message and reload button when default location call fails", () => {
    cy.intercept("http://localhost:3000/api/default_locations", {
      statusCode: 500,
      body: "error",
    });

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
    cy.intercept(
      "http://localhost:3000/api/user_locations?user_id=101000928729222042760",
      { statusCode: 500 }
    );

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
