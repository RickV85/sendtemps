import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '361teg',
  retries: {
    runMode: 3,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
  },
});
