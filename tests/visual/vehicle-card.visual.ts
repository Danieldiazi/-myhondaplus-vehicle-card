import { expect, test, type Page } from "@playwright/test";

const card = "myhondaplus-vehicle-card";
const editor = "myhondaplus-vehicle-card-editor";

async function openScenario(page: Page, query: string): Promise<void> {
  await page.goto(`/tests/visual/?${query}`);
  await page.waitForFunction(() => window.__visualReady === true);
  await expect(page.locator(card)).toBeVisible();
}

async function openEditorScenario(page: Page, query: string): Promise<void> {
  await page.goto(`/tests/visual/?target=editor&${query}`);
  await page.waitForFunction(() => window.__visualReady === true);
  await expect(page.locator(editor)).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflows = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflows).toBe(false);
}

async function expectArtworkAboveFreshness(page: Page): Promise<void> {
  const artwork = await page.locator(`${card} .vehicle-art`).boundingBox();
  const freshness = await page.locator(`${card} .freshness`).boundingBox();
  expect(artwork).not.toBeNull();
  expect(freshness).not.toBeNull();
  expect(artwork!.y + artwork!.height).toBeLessThanOrEqual(freshness!.y + 1);
}

test("Civic full layout remains readable on a light desktop", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1100 });
  await openScenario(page, "model=civic&layout=full&theme=light&locale=en");

  await expect(page.locator(`${card} .civic-lateral-art`)).toBeVisible();
  await expect(page.locator(`${card} .metrics .metric`)).toHaveCount(5);
  await expect(page.locator(`${card} .statuses .status`)).toHaveCount(7);
  await expect(page.locator(`${card} nav[aria-label='Vehicle controls']`)).toBeVisible();
  const [metricBackground, controlBackground] = await Promise.all([
    page
      .locator(`${card} .metric`)
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor),
    page
      .locator(`${card} .controls button`)
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ]);
  expect(controlBackground).not.toBe(metricBackground);
  await expectArtworkAboveFreshness(page);
  await expectNoHorizontalOverflow(page);
});

test("generic compact layout exposes climate on a dark mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await openScenario(page, "model=hrv&layout=compact&theme=dark&locale=gl");

  await expect(page.locator(`${card} .honda-logo-art`)).toBeVisible();
  await expect(page.locator(`${card} .compact-statuses .status`)).toHaveCount(1);
  await expect(page.locator(`${card} .compact-statuses`)).toContainText("Clima");
  const metricColumns = await page
    .locator(`${card} .metrics`)
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(metricColumns).toBe(1);
  await expectArtworkAboveFreshness(page);
  await expectNoHorizontalOverflow(page);
});

test("a broken custom image shows the localized Honda fallback", async ({ page }) => {
  await page.setViewportSize({ width: 620, height: 1000 });
  await openScenario(page, "model=civic&layout=full&theme=light&locale=es&customImageFailure=true");

  await expect(page.locator(`${card} .custom-vehicle-art`)).toHaveCount(0);
  await expect(page.locator(`${card} .honda-logo-art`)).toBeVisible();
  await expect(page.locator(`${card} [role='alert']`)).toContainText(
    "No se pudo cargar la imagen personalizada",
  );
  await expectArtworkAboveFreshness(page);
  await expectNoHorizontalOverflow(page);
});

test("the editor explains when the integration is missing", async ({ page }) => {
  await openEditorScenario(page, "discovery=missingIntegration&locale=es");

  await expect(page.locator(editor)).toContainText("Integración My Honda+ no detectada");
  await expect(page.locator(`${editor} a`)).toHaveAttribute("href", /myhondaplus-homeassistant/);
  await expect(page.locator(`${editor} button`)).toContainText("Volver a detectar");
});

test("the editor distinguishes an installed integration with no vehicles", async ({ page }) => {
  await openEditorScenario(page, "discovery=noVehicles&locale=en");

  await expect(page.locator(editor)).toContainText("My Honda+ integration detected");
  await expect(page.locator(editor)).toContainText(
    "No configured vehicle with My Honda+ entities was found",
  );
});

test("the editor reports the selected vehicle capabilities", async ({ page }) => {
  await openEditorScenario(page, "discovery=ready&locale=gl");

  await expect(page.locator(editor)).toContainText("Capacidades detectadas");
  await expect(page.locator(`${editor} .chip`)).not.toHaveCount(0);
});

test("Home Assistant state updates do not restart editor discovery", async ({ page }) => {
  await openEditorScenario(page, "discovery=ready&discoveryDelay=true&locale=es");
  const status = page.locator(`${editor} .integration-status`);

  await expect(status).toContainText("Integración My Honda+ detectada");
  await page.locator(editor).evaluate((element) => {
    const component = element as HTMLElement & { hass: Record<string, unknown> };
    component.hass = { ...component.hass };
  });
  await page.waitForTimeout(75);

  await expect(status).toContainText("Integración My Honda+ detectada");
  await expect(status).not.toContainText("Comprobando");
  await expect(page.locator(`${editor} .hint`)).toContainText("Vehículos encontrados: 1");
});

test("the card shows an actionable diagnostic when the integration is missing", async ({
  page,
}) => {
  await openScenario(page, "discovery=missingIntegration&locale=es");

  await expect(page.locator(`${card} .setup`)).toContainText(
    "No se detectó la integración My Honda+",
  );
  await expect(page.locator(`${card} .setup a`)).toHaveAttribute(
    "href",
    /myhondaplus-homeassistant/,
  );
  await expect(page.locator(`${card} .vehicle-art`)).toHaveCount(0);
});

test("the card explains when a vehicle has no compatible entities", async ({ page }) => {
  await openScenario(page, "discovery=noCompatible&locale=en");

  await expect(page.locator(`${card} .setup`)).toContainText(
    "No compatible entities were found for this vehicle",
  );
  await expect(page.locator(`${card} .vehicle-art`)).toHaveCount(0);
});
