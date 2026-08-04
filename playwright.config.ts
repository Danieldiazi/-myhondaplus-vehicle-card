import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  testMatch: "**/*.visual.ts",
  outputDir: "test-results",
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm exec vite -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173/tests/visual/",
    reuseExistingServer: !process.env.CI,
  },
});
