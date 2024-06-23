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

    // Intercept OpenAI AI call
    cy.intercept("/api/open_ai/send_score", { fixture: "sendscore.json" });

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
        "Sunny. High near 57, with temperatures falling to around 52 in the afternoon. West wind 30 to 36 mph, with gusts as high as 54 mph. Humidity 19% to 17% RH."
      );
  });

  it("should display a summary from AI data", () => {
    cy.get("div.send-score-summary").should(
      "have.text",
      "Thursday is the best day for rock climbing with sunny skies, a high near 51°F, and light west winds. Friday is also a good option with a high near 61°F and light southwest winds. Saturday could work as well with a high near 59°F and mostly clear skies."
    );
  });

  it("should display the SendScore on forecast tiles", () => {
    cy.get("article.detailed-day-forecast")
      .eq(1)
      .as("tonightForecast")
      .find("div.day-send-score-div>p")
      .should("have.text", "SendScore:1");
  });

  it("should display a tip to click on forecast tiles for hourly forecasts", () => {
    cy.get("p.hour-forecast-tip").should("be.visible");
  });
});
