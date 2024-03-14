// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

  // Ignore Google maps 3d context error when run in GH Actions
  Cypress.on("uncaught:exception", (err, runnable) => {
    console.log("error", err);
    console.log("error.msg", err.message)

    if (err.message.includes("Could not find a 3d context, error: 10")) {
      console.log("return fired")
      return false;
    }
  });

// Alternatively you can use CommonJS syntax:
// require('./commands')