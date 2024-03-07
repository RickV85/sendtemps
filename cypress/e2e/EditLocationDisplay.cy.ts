import { should } from "chai";

describe("Edit locations display", () => {
  beforeEach(() => {
    // Intercept and return user session object
    cy.intercept("/api/auth/session", {
      fixture: "session.json",
    });

    // Intercept user login patch req
    cy.intercept(
      "/api/users",
      JSON.stringify(
        "New user data for id: 101000928729222042760 matches previous user data from database. New login: 2024-02-25T17:35:44.233Z"
      )
    );

    // Intercept user location req
    cy.intercept("/api/user_locations?user_id=101000928729222042760", {
      fixture: "user_locs.json",
    });

    // Intercept default locations req
    cy.intercept("/api/default_locations", {
      fixture: "default_locs.json",
    });

    cy.visit("/");

    cy.get("button#navLocationBtn").click();

    cy.wait(250);
  });

  it("should display the site title, 'SendTemps' and return user to Home when clicked", () => {
    cy.wait(500);
    cy.get("h1").should("have.text", "SendTemps").click();

    cy.wait(500).location("pathname").should("equal", "/");
  });

  it("should display the Back button and allow user to return to Home", () => {
    cy.get("button#editLocBackBtn")
      .should("be.visible")
      .should("have.text", "Back")
      .click();

    cy.wait(250).location("pathname").should("equal", "/");
  });

  it("should show the heading for the edit location section", () => {
    cy.get("h2").eq(0).should("have.text", "Edit Custom Locations");
  });

  it("should display a select to pick a custom location to edit", () => {
    cy.get("select#editUserLocSelect").as("editLocSelect").should("be.visible");
    cy.get("@editLocSelect")
      .find("option")
      .eq(0)
      .should("have.text", "Choose location");

    cy.get("@editLocSelect").find("option").eq(1).should("have.text", "Eldora");
  });

  it("should display initial location detail terms", () => {
    cy.get("dl").as("detailsList");
    cy.get("@detailsList").contains("Lat");
    cy.get("@detailsList").contains("Long");
    cy.get("@detailsList").contains("Type");
    cy.get("@detailsList").contains("Created");
    cy.get("@detailsList").contains("Modified");
  });

  it("should show the heading for the add location section", () => {
    cy.get("h2").eq(1).should("have.text", "Add New Location");
  });

  it("should have a message to instruct user on how to use map to add location", () => {
    cy.get("section.add-loc-section")
      .find("p")
      .should(
        "have.text",
        "Scroll down to view entire map below, then click on the map where you would like to create a new location."
      );
  });

  it("should display the map", () => {
    cy.get("div.map-container").find("div").eq(0).should("be.visible");
  });
});
