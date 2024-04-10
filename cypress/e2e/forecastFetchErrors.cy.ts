describe("daily forecast display errors", () => {
  beforeEach(() => {
    // Intercept and return empty object for unauthorized user
    cy.intercept("/api/auth/session", JSON.stringify({}));

    // Intercept default_locs api call
    cy.intercept("/api/default_locations", {
      fixture: "default_locs.json",
    });

    cy.visit("/");

    // Select Climbing in TypeSelect
    cy.get("select.type-select").select("Climbing");

    // Select Boulder Canyon - Lower in TypeSelect
    cy.get("select.location-select").select("Boulder Canyon - Lower");
  });

  it("should display an error message when grid location call fails", () => {
    // Intercept Climbing - Lower Boulder Canyon fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.004482,-105.355800", {
      statusCode: 500,
    });

    cy.intercept("https://api.weather.gov/points/40.0045,-105.3558", {
      statusCode: 500,
    });

    cy.wait(10000);

    cy.get("div.loading-msg-div")
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

    // Intercept Climbing - Lower Boulder Canyon redirected fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.0045,-105.3558", {
      fixture: "location_details.json",
    });

    // Intercept Lower Boulder Canyon Detailed daily forecast
    cy.intercept("https://api.weather.gov/gridpoints/BOU/51,74/forecast", {
      statusCode: 500,
    });

    // Intercept Lower Boulder Canyon hourly forecast
    cy.intercept(
      "https://api.weather.gov/gridpoints/BOU/51,74/forecast/hourly",
      {
        fixture: "hourly_forecast.json",
      }
    );

    // Intercept OpenAI AI call
    cy.intercept("/api/open_ai/send_score", { fixture: "sendscore.json" });

    cy.wait(10000);

    cy.get("div.loading-msg-div")
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

    // Intercept Climbing - Lower Boulder Canyon redirected fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.0045,-105.3558", {
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

    // Intercept OpenAI AI call
    cy.intercept("/api/open_ai/send_score", { fixture: "sendscore.json" });

    cy.wait(10000);

    cy.get("div.loading-msg-div")
      .find("p.error-msg")
      .should(
        "have.text",
        "Oh, no! All hourly forecast fetch attempts failed. Please reload the page and try again."
      );
  });

  it("should display an error when the OpenAI fetch fails", () => {
    // Intercept Climbing - Lower Boulder Canyon fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.004482,-105.355800", {
      fixture: "location_details.json",
    });

    // Intercept Climbing - Lower Boulder Canyon redirected fetchNoaaGridLocation call
    cy.intercept("https://api.weather.gov/points/40.0045,-105.3558", {
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
        fixture: "hourly_forecast.json",
      }
    );

    // Intercept OpenAI AI call
    cy.intercept("/api/open_ai/send_score", { statusCode: 500 });

    cy.get("div.loading-msg-div")
      .find("p.error-msg")
      .should(
        "have.text",
        "Oh, no! An error occurred while creating SendScores."
      );
  });
});
