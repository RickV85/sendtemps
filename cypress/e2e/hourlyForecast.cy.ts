describe("hourly forecast display", () => {
  beforeEach(() => {
    // Intercept and return empty object for unauthorized user
    cy.intercept("/api/auth/session", JSON.stringify({}));

    // Intercept default_locs api call
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

    cy.visit("http://localhost:3000");

    // Select Climbing in TypeSelect
    cy.get("select.type-select").select("Climbing");

    // Select Boulder Canyon - Lower in TypeSelect
    cy.get("select.location-select").select("Boulder Canyon - Lower");

    // Click forecast tile to show hourly
    cy.get("article.detailed-day-forecast").eq(0).click();

    cy.get("div.hourly-forecast-container")
      .find("article")
      .eq(0)
      .as("hourlyTile");
  });

  it("should display the time period name", () => {
    cy.get("header.hourly-forecast-header > h2").should("have.text", "Today");
  });

  it("should display a time for each time period", () => {
    cy.get("@hourlyTile").find("h3").should("have.text", "10:00 AM");
  });

  it("should display the temperature and conditions", () => {
    cy.get("@hourlyTile").find("div").eq(1).contains("50 °F");
    cy.get("@hourlyTile").find("div").eq(1).contains("Sunny");
  });

  it("should display the chance of precipitation", () => {
    cy.get("@hourlyTile").find("div").eq(2).contains("0%");
    cy.get("@hourlyTile").find("div").eq(2).contains("Precip.");
  });

  it("should display the wind conditions", () => {
    cy.get("@hourlyTile").find("div").eq(3).contains("31 mph");
    cy.get("@hourlyTile").find("div").eq(3).contains("W");
  });

  it("should display the relative humidity", () => {
    cy.get("@hourlyTile").find("div").eq(4).contains("17%");
    cy.get("@hourlyTile").find("div").eq(4).contains("RH");
  });

  it("should allow you to return to the daily forecast view", () => {
    cy.get("button.hourly-close-btn").click();

    cy.get("div.hourly-forecast-container").should("not.exist");
    cy.get("article.detailed-day-forecast").eq(0).should("be.visible");
  });
});
