import { describe, expect, it } from "vitest";
import { resolveVehicleModel } from "../src/model-resolver";

const device = (model: string) => ({ id: "vehicle", model, manufacturer: "Honda" });

describe("resolveVehicleModel", () => {
  it("detects the supported Honda families", () => {
    expect(resolveVehicleModel(device("Civic e:HEV Advance"))).toBe("civic");
    expect(resolveVehicleModel(device("CR-V Hybrid"))).toBe("crv");
    expect(resolveVehicleModel(device("Honda e:Ny1"))).toBe("eny1");
  });

  it("falls back safely for unknown models", () => {
    expect(resolveVehicleModel(device("Unknown Honda"))).toBe("generic");
  });
});
