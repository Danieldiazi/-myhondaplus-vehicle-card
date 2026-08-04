import { describe, expect, it } from "vitest";
import { localize, normalizeLocale } from "../src/localize";

describe("localize", () => {
  it("normalizes supported language variants", () => {
    expect(normalizeLocale("gl-ES")).toBe("gl");
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("fr-FR")).toBe("es");
  });

  it("replaces interpolation tokens", () => {
    expect(localize("updated_minutes", "en", { count: 8 })).toBe("Updated 8 min ago");
    expect(localize("editor_vehicles_found", "gl", { count: 2 })).toBe("Vehículos atopados: 2");
  });

  it("localizes editor, diagnostics and image fallback messages", () => {
    expect(localize("editor_appearance", "en")).toBe("Appearance");
    expect(localize("copy_diagnostics", "es")).toBe("Copiar diagnóstico anonimizado");
    expect(localize("custom_image_failed", "gl")).toContain("logo de Honda");
    expect(localize("editor_integration_not_detected", "es")).toContain("no detectada");
    expect(localize("editor_redetect_entities", "gl")).toContain("Volver detectar");
    expect(localize("editor_capabilities", "en")).toBe("Detected capabilities");
  });
});
