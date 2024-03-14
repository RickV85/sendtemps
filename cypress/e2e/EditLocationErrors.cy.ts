describe("Edit Location errors", () => {
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
    cy.intercept("GET", "/api/default_locations", {
      fixture: "default_locs.json",
    });

    cy.visit("/edit-locations");
  });

  it("should show an error on failed deletion", () => {
    cy.intercept("DELETE", "/api/user_locations", {
      statusCode: 500,
      body: "Error",
    });

    cy.get("select#editUserLocSelect").select(1);
    cy.get("button#userLocDeleteBtn").as("deleteBtn");
    cy.get("@deleteBtn").click();

    cy.get("dialog#userLocModal")
      .find("button")
      .eq(1)
      .should("have.text", "Confirm")
      .click();

    cy.wait(250);

    cy.get("p.edit-user-loc-modal-msg").should(
      "have.text",
      "An error occurred while deleting location. Please try again."
    );
  });

  it("should show an error on failed rename", () => {
    cy.intercept("PATCH", "/api/user_locations", {
      statusCode: 500,
      body: "Error",
    });

    cy.get("select#editUserLocSelect").select(1);
    cy.get("button#userLocRenameBtn").as("renameBtn");
    cy.get("@renameBtn").click();

    cy.get("dialog#userLocModal")
      .find("button")
      .eq(1)
      .as("confirmBtn")
      .should("have.text", "Confirm")
      .click();

    cy.get("p.edit-user-loc-modal-msg")
      .as("errorMsg")
      .should("have.text", "Please enter a name");

    cy.get("input#editUserLocNameInput")
      .as("nameInput")
      .type("kjwnfkjwnefkwjnfkjwnefnwenofnolkndlwnefwenfninfwefe");

    cy.get("@confirmBtn").click();

    cy.get("@errorMsg").should(
      "have.text",
      "Name cannot be longer than 50 characters"
    );

    cy.get("@nameInput").should("not.contain.text");

    cy.get("@nameInput").type("<script>something malicious</script>");

    cy.get("@confirmBtn").click();

    cy.get("@errorMsg").should("have.text", "NO XSS");

    cy.get("@nameInput").should("not.have.text");

    cy.get("@nameInput").type("Renamed");

    cy.get("@confirmBtn").click();

    cy.wait(250);

    cy.get("@errorMsg").should(
      "have.text",
      "An error occurred while modifying location. Please try again."
    );
  });

  it("should show an error on failed type change", () => {
    cy.intercept("PATCH", "/api/user_locations", {
      statusCode: 500,
      body: "Error",
    });

    cy.get("select#editUserLocSelect").select(1);
    cy.get("button#userLocTypeBtn").as("typeBtn");
    cy.get("@typeBtn").click();

    cy.get("dialog#userLocModal")
      .find("button")
      .eq(1)
      .as("confirmBtn")
      .should("have.text", "Confirm")
      .click();

    cy.get("p.edit-user-loc-modal-msg").should(
      "have.text",
      "Please choose a type"
    );

    cy.get("select.edit-loc-input").select(1);

    cy.get("@confirmBtn").click();

    cy.wait(250);

    cy.get("p.edit-user-loc-modal-msg").should(
      "have.text",
      "An error occurred while modifying location. Please try again."
    );
  });
});
