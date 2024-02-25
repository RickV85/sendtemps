describe("daily forecast display", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    // Intercept and return empty object for unauthorized user
    cy.intercept("http://localhost:3000/api/auth/session", {});

    // Intercept def_locs api call
    cy.intercept("http://localhost:3000/api/default_locations", {
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

    // Select Climbing in TypeSelect
    cy.get("select.type-select").select("Climbing");
    // Select Boulder Canyon - Lower in TypeSelect
    cy.get("select.location-select").select("Boulder Canyon - Lower");
    // Create alias todayDetailedForecast
    cy.get("article.detailed-day-forecast").eq(0).as("todayDetailedForecast");
  });

  it("should display the detailed daily forecast when a location is selected", () => {
    cy.get("@todayDetailedForecast").find("h2").should("have.text", "Today");
    cy.get("@todayDetailedForecast")
      .find("p.day-forecast-text")
      .should(
        "have.text",
        "Sunny. High near 57, with temperatures falling to around 52 in the afternoon. West wind 30 to 36 mph, with gusts as high as 54 mph."
      );
  });
});
