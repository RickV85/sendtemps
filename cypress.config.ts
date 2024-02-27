import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '361teg',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
