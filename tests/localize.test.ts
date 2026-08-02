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
  });
});
