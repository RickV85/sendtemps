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

    // Failing on run due to Google req 3d context
    cy.intercept("GET", "https://maps.googleapis.com/maps-api-v3/api/js/56/3/*");

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

  it("should show the Delete button, open modal, allow return, and deletion", () => {
    cy.intercept(
      "DELETE",
      "/api/user_locations",
      JSON.stringify(
        "Success: User Location id: 34 for user_id: 101000928729222042760 successfully deleted"
      )
    );

    cy.get("button#userLocDeleteBtn").as("deleteBtn").should("be.visible");

    cy.get("@deleteBtn").click();
    // Tests for no location selected, not needed on next two tests of CRUD functions
    cy.get("dialog#userLocModal")
      .as("locModal")
      .contains("Please select a location before editing.");
    cy.get("button.edit-user-loc-button").should("be.visible").click();

    cy.get("select#editUserLocSelect").select(1);
    cy.get("@deleteBtn").click();
    cy.get("@locModal").contains('Are you sure you want to delete "Eldora"?');
    cy.get("@locModal")
      .find("button")
      .eq(0)
      .should("have.text", "Cancel")
      .click();
    cy.get("@locModal").should("not.be.visible");

    cy.get("@deleteBtn").click();
    cy.get("@locModal")
      .find("button")
      .eq(1)
      .should("have.text", "Confirm")
      .click();

    cy.get("select#editUserLocSelect").should("not.exist");
  });

  it("should show the Rename button, open modal, allow return, and rename", () => {
    cy.intercept("PATCH", "/api/user_locations", {
      patchLoc: {
        id: 34,
        name: "Renamed",
        latitude: "40.041410",
        longitude: "-105.089064",
        user_id: "101000928729222042760",
        poi_type: "ski",
        date_created: "2024-03-06T21:42:17.348Z",
        last_modified: "2024-03-07T14:50:42.158Z",
      },
    });

    cy.get("button#userLocRenameBtn").as("renameBtn").should("be.visible");

    cy.get("@renameBtn").click();
    cy.get("button.edit-user-loc-button").should("be.visible").click();

    cy.get("select#editUserLocSelect").select(1);
    cy.get("@renameBtn").click();
    cy.get("dialog#userLocModal").as("locModal").contains('Rename "Eldora"?');
    cy.get("@locModal")
      .find("button")
      .eq(0)
      .should("have.text", "Cancel")
      .click();
    cy.get("@locModal").should("not.be.visible");

    cy.get("@renameBtn").click();
    cy.get("input#editUserLocNameInput").type("Renamed");
    cy.get("@locModal")
      .find("button")
      .eq(1)
      .should("have.text", "Confirm")
      .click();

    cy.get("select#editUserLocSelect")
      .find("option")
      .eq(1)
      .should("have.text", "Renamed");
  });

  it("should show the Change Type button, open modal, allow return, and change type", () => {
    cy.intercept("PATCH", "/api/user_locations", {
      patchLoc: {
        id: 34,
        name: "Eldora",
        latitude: "40.041410",
        longitude: "-105.089064",
        user_id: "101000928729222042760",
        poi_type: "mtb",
        date_created: "2024-03-06T21:42:17.348Z",
        last_modified: "2024-03-07T14:50:42.158Z",
      },
    });

    cy.get("button#userLocTypeBtn").as("typeBtn").should("be.visible");

    cy.get("@typeBtn").click();
    cy.get("button.edit-user-loc-button").should("be.visible").click();

    cy.get("select#editUserLocSelect").select(1);
    cy.get("@typeBtn").click();
    cy.get("dialog#userLocModal")
      .as("locModal")
      .contains('Change "Eldora" sport type?');
    cy.get("@locModal")
      .find("button")
      .eq(0)
      .should("have.text", "Cancel")
      .click();
    cy.get("@locModal").should("not.be.visible");

    cy.get("@typeBtn").click();
    cy.get("select.edit-loc-input").select("Mountain Biking");
    cy.get("@locModal")
      .find("button")
      .eq(1)
      .should("have.text", "Confirm")
      .click();

    cy.get("select#editUserLocSelect").select("Eldora");

    cy.get("dl")
      .find("div")
      .eq(2)
      .find("dd")
      .should("have.text", "Mountain Biking");
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
