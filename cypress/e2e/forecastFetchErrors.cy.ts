describe("daily forecast display errors", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    // Intercept and return empty object for unauthorized user
    cy.intercept("http://localhost:3000/api/auth/session", {});

    // Intercept default_locs api call
    cy.intercept("http://localhost:3000/api/default_locations", {
      fixture: "default_locs.json",
    });

    // Select Climbing in TypeSelect
    cy.get("select.type-select").select("Climbing");

    // Select Boulder Canyon - Lower in TypeSelect
    cy.get("select.location-select").select("Boulder Canyon - Lower");
  });

  it("should display an error message when grid location call fails", () => {
    // Intercept Climbing - Lower Boulder Canyon fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.004482,-105.355800", {
      statusCode: 500,
      body: "error",
    });

    cy.intercept("https://api.weather.gov/points/40.0045,-105.3558", {
      statusCode: 500,
      body: "error",
    });

    cy.wait(10000);

    cy.get("div.error-msg-div")
      .find("p.error-msg")
      .should(
        "have.text",
        "Oh, no! All attempts to fetch NOAA grid location failed for coordinates: 40.004482,-105.355800. Please reload the page and try again."
      );
  });

  it("should display an error message when daily forecast fetch fails", () => {
    // Intercept Climbing - Lower Boulder Canyon fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.004482,-105.355800", {
      fixture: "location_details.json",
    });

    // Intercept Lower Boulder Canyon Detailed daily forecast
    cy.intercept("https://api.weather.gov/gridpoints/BOU/51,74/forecast", {
      statusCode: 500,
    });

    cy.wait(10000);

    cy.get("div.error-msg-div")
      .find("p.error-msg")
      .should(
        "have.text",
        "Oh, no! All daily forecast fetch attempts failed. Please reload the page and try again."
      );
  });

  it("should display an error message when hourly forecast fetch fails", () => {
    // Intercept Climbing - Lower Boulder Canyon fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.004482,-105.355800", {
      fixture: "location_details.json",
    });

    // Intercept Lower Boulder Canyon Detailed daily forecast
    cy.intercept("https://api.weather.gov/gridpoints/BOU/51,74/forecast", {
      fixture: "detailed_forecast.json",
    });

    // Intercept Lower Boulder Canyon hourly forecast
    cy.intercept(
      "https://api.weather.gov/gridpoints/BOU/51,74/forecast/hourly",
      {
        statusCode: 500,
      }
    );

    cy.get("article.detailed-day-forecast").eq(0).click();

    cy.wait(10000);

    cy.get("div.error-msg-div")
      .find("p.error-msg")
      .should(
        "have.text",
        "Oh, no! All hourly forecast fetch attempts failed. Please reload the page and try again."
      );
  });
});
