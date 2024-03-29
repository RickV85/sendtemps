describe("daily forecast display", () => {
  beforeEach(() => {
    // Intercept and return empty object for unauthorized user
    cy.intercept("/api/auth/session", JSON.stringify({}));

    // Intercept default_locs api call
    cy.intercept("/api/default_locations", {
      fixture: "default_locs.json",
    });

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
        fixture: "hourly_forecast.json",
      }
    );

    cy.visit("/");

    // Select Climbing in TypeSelect
    cy.get("select.type-select").select("Climbing");

    // Select Boulder Canyon - Lower in TypeSelect
    cy.get("select.location-select").select("Boulder Canyon - Lower");

    // Create alias todayForecast
    cy.get("article.detailed-day-forecast").eq(0).as("todayForecast");
  });

  it("should display the detailed daily forecast when a location is selected", () => {
    cy.get("@todayForecast").find("h2").should("have.text", "Today");
    cy.get("@todayForecast")
      .find("p.day-forecast-text")
      .should(
        "have.text",
        "Sunny. High near 57, with temperatures falling to around 52 in the afternoon. West wind 30 to 36 mph, with gusts as high as 54 mph."
      );
  });

  it("should display the humidity details if available", () => {
    cy.get("@todayForecast")
      .find("div.day-header-details>p")
      .eq(0)
      .should("have.text", "Max 19% RH");

      cy.get("@todayForecast")
      .find("div.day-header-details>p")
      .eq(1)
      .should("have.text", "Min 17% RH");
  });
});
