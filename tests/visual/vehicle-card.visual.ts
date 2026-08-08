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
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  expect(overflows).toBe(false);
}

async function expectArtworkAboveFreshness(page: Page): Promise<void> {
  const artwork = await page.locator(`${card} .vehicle-art`).boundingBox();
  const freshness = await page.locator(`${card} .freshness`).boundingBox();
  expect(artwork).not.toBeNull();
  expect(freshness).not.toBeNull();
  expect(artwork!.y + artwork!.height).toBeLessThanOrEqual(freshness!.y + 1);
}

async function expectMoreInfo(
  page: Page,
  selector: string,
  entityId: string,
): Promise<void> {
  await page.locator(card).evaluate((element) => {
    element.addEventListener(
      "hass-more-info",
      (event) => {
        document.body.dataset.moreInfoEntityId = (
          event as CustomEvent<{ entityId: string }>
        ).detail.entityId;
      },
      { once: true },
    );
  });
  await page.locator(`${card} ${selector}`).click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-more-info-entity-id",
    entityId,
  );
}

test("Civic full layout remains readable on a light desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 1100 });
  await openScenario(page, "model=civic&layout=full&theme=light&locale=en");

  await expect(page.locator(`${card} .civic-lateral-art`)).toBeVisible();
  await expect(page.locator(`${card} .metrics .metric`)).toHaveCount(5);
  await expect(page.locator(`${card} .statuses .status`)).toHaveCount(8);
  await expect(
    page.locator(`${card} nav[aria-label='Vehicle controls']`),
  ).toBeVisible();
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
  const themedSecondaryBackground = await page
    .locator(card)
    .evaluate((element) => {
      const probe = document.createElement("div");
      probe.style.background = "var(--secondary-background-color)";
      element.shadowRoot?.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    });
  expect(metricBackground).toBe(themedSecondaryBackground);

  await expectMoreInfo(
    page,
    ".metric[aria-label='Odometer: 17505 km']",
    "sensor.synthetic_odometer",
  );
  await expectMoreInfo(
    page,
    ".status[aria-label='Doors: Closed']",
    "binary_sensor.synthetic_doors",
  );
  await expectMoreInfo(page, ".badge", "lock.synthetic_vehicle");
  await expectMoreInfo(page, ".freshness", "sensor.synthetic_updated");
  await expectMoreInfo(
    page,
    ".info-status",
    "device_tracker.synthetic_location",
  );
  await expect(
    page.locator(`${card} .controls button[aria-label='Location']`),
  ).toHaveCount(0);
  await expect(page.locator(`${card} .metric .detail-indicator`)).toHaveCount(
    5,
  );
  await expect(page.locator(`${card} .status .detail-indicator`)).toHaveCount(
    8,
  );
  await expect(page.locator(`${card} .badge .detail-indicator`)).toHaveCount(1);
  await expect(
    page.locator(`${card} .freshness .detail-indicator`),
  ).toHaveCount(1);
  const [cardTypography, statusTypography, controlTypography] =
    await Promise.all([
      page.locator(card).evaluate((element) => {
        const style = getComputedStyle(element);
        return { family: style.fontFamily, size: style.fontSize };
      }),
      page
        .locator(`${card} .status`)
        .first()
        .evaluate((element) => {
          const style = getComputedStyle(element);
          return { family: style.fontFamily, size: style.fontSize };
        }),
      page
        .locator(`${card} .controls button`)
        .first()
        .evaluate((element) => {
          const style = getComputedStyle(element);
          return { family: style.fontFamily, size: style.fontSize };
        }),
    ]);
  expect(statusTypography).toEqual(cardTypography);
  expect(controlTypography).toEqual(cardTypography);
  await expectArtworkAboveFreshness(page);
  await expectNoHorizontalOverflow(page);
});

test("generic compact layout exposes climate on a dark mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await openScenario(page, "model=hrv&layout=compact&theme=dark&locale=gl");

  await expect(page.locator(`${card} .honda-logo-art`)).toBeVisible();
  await expect(page.locator(`${card} .compact-statuses .status`)).toHaveCount(
    2,
  );
  await expect(page.locator(`${card} .compact-statuses`)).toContainText(
    "Clima",
  );
  const metricColumns = await page
    .locator(`${card} .metrics`)
    .evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
  expect(metricColumns).toBe(1);
  await expectArtworkAboveFreshness(page);
  await expectNoHorizontalOverflow(page);
});

test("configured states preserve their chosen order and hide unselected states", async ({
  page,
}) => {
  await openScenario(
    page,
    "model=civic&layout=full&locale=es&statuses=location,doors,lights",
  );

  const labels = await page
    .locator(`${card} .statuses .status`)
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-label")),
    );
  expect(labels).toEqual([
    "Ubicación: Home",
    "Puertas: Cerrado",
    "Luces: Apagadas",
  ]);
});

test("remote confirmations and stale warnings run before service calls", async ({
  page,
}) => {
  await openScenario(
    page,
    "model=civic&layout=full&locale=es&confirmations=true",
  );

  const hornDialogPromise = page.waitForEvent("dialog");
  const hornClick = page
    .locator(`${card} .controls button[aria-label='Bocina y luces']`)
    .click();
  const hornDialog = await hornDialogPromise;
  expect(hornDialog.message()).toContain("¿Activar la bocina y las luces?");
  await hornDialog.accept();
  await hornClick;
  await expect(page.locator("body")).toHaveAttribute(
    "data-called-service",
    "button.press",
  );

  await openScenario(page, "model=civic&layout=full&locale=es&stale=true");
  const staleDialogPromise = page.waitForEvent("dialog");
  const refreshClick = page
    .locator(`${card} .controls button[aria-label='Actualizar desde el coche']`)
    .click();
  const staleDialog = await staleDialogPromise;
  expect(staleDialog.message()).toContain(
    "Los datos del vehículo están desactualizados",
  );
  await staleDialog.accept();
  await refreshClick;
});

test("a broken custom image shows the localized Honda fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 620, height: 1000 });
  await openScenario(
    page,
    "model=civic&layout=full&theme=light&locale=es&customImageFailure=true",
  );

  await expect(page.locator(`${card} .custom-vehicle-art`)).toHaveCount(0);
  await expect(page.locator(`${card} .honda-logo-art`)).toBeVisible();
  await expect(page.locator(`${card} [role='alert']`)).toContainText(
    "No se pudo cargar la imagen personalizada",
  );
  await expectArtworkAboveFreshness(page);
  await expectNoHorizontalOverflow(page);
});

test("the editor explains when the integration is missing", async ({
  page,
}) => {
  await openEditorScenario(page, "discovery=missingIntegration&locale=es");

  await expect(page.locator(editor)).toContainText(
    "Integración My Honda+ no detectada",
  );
  await expect(page.locator(`${editor} a`)).toHaveAttribute(
    "href",
    /myhondaplus-homeassistant/,
  );
  await expect(page.locator(`${editor} button`)).toContainText(
    "Volver a detectar",
  );
});

test("the editor distinguishes an installed integration with no vehicles", async ({
  page,
}) => {
  await openEditorScenario(page, "discovery=noVehicles&locale=en");

  await expect(page.locator(editor)).toContainText(
    "My Honda+ integration detected",
  );
  await expect(page.locator(editor)).toContainText(
    "No configured vehicle with My Honda+ entities was found",
  );
});

test("the editor reports the selected vehicle capabilities", async ({
  page,
}) => {
  await openEditorScenario(page, "discovery=ready&locale=gl");

  await expect(page.locator(editor)).toContainText("Capacidades detectadas");
  await expect(page.locator(`${editor} .chip`)).not.toHaveCount(0);
  await expect(page.locator(editor)).toContainText("Estados");
  await expect(
    page.locator(`${editor} .ordered-checks .check-row`),
  ).toHaveCount(8);
  await expect(
    page.locator(`${editor} input[name='confirm_climate']`),
  ).toBeVisible();
  await expect(
    page.locator(`${editor} input[name='warn_stale_actions']`),
  ).toBeChecked();
});

test("Home Assistant state updates do not restart editor discovery", async ({
  page,
}) => {
  await openEditorScenario(
    page,
    "discovery=ready&discoveryDelay=true&locale=es",
  );
  const status = page.locator(`${editor} .integration-status`);

  await expect(status).toContainText("Integración My Honda+ detectada");
  await page.locator(editor).evaluate((element) => {
    const component = element as HTMLElement & {
      hass: Record<string, unknown>;
    };
    component.hass = { ...component.hass };
  });
  await page.waitForTimeout(75);

  await expect(status).toContainText("Integración My Honda+ detectada");
  await expect(status).not.toContainText("Comprobando");
  await expect(page.locator(`${editor} .hint`)).toContainText(
    "Vehículos encontrados: 1",
  );
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

test("the card explains when a vehicle has no compatible entities", async ({
  page,
}) => {
  await openScenario(page, "discovery=noCompatible&locale=en");

  await expect(page.locator(`${card} .setup`)).toContainText(
    "No compatible entities were found for this vehicle",
  );
  await expect(page.locator(`${card} .vehicle-art`)).toHaveCount(0);
});
