import { error } from "console";
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "361teg",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Ignore Google maps 3d context error when run in GH Actions
      Cypress.on("uncaught:exception", (err, runnable) => {
        console.log("error", err);
        console.log("error.msg", err.message)

        if (err.message.includes("Could not find a 3d context, error: 10")) {
          console.log("return fired")
          return false;
        }
      });
    },
    retries: {
      runMode: 2,
      openMode: 0,
    },
    baseUrl: "http://localhost:3000",
  },
});
