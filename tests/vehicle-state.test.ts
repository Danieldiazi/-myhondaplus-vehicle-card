import { describe, expect, it } from "vitest";
import type { HassEntity } from "../src/types";
import { buildVehicleState, entityDisplayValue } from "../src/vehicle-state";

const entity = (
  state: string,
  unit?: string,
  lastUpdated = "2026-08-02T10:00:00Z",
): HassEntity => ({
  entity_id: "sensor.test",
  state,
  attributes: unit ? { unit_of_measurement: unit } : {},
  last_updated: lastUpdated,
});

describe("vehicle state", () => {
  it("formats unavailable values safely", () => {
    expect(entityDisplayValue(entity("unavailable"))).toBe("—");
    expect(entityDisplayValue(entity("72", "%"))).toBe("72 %");
  });

  it("normalizes active states and freshness", () => {
    const state = buildVehicleState(
      {
        lock: entity("locked"),
        range: entity("420", "km"),
        charging: entity("charging"),
        doors: entity("off"),
      },
      300,
      Date.parse("2026-08-02T10:10:00Z"),
    );

    expect(state.locked).toBe(true);
    expect(state.range).toBe("420 km");
    expect(state.charging).toBe(true);
    expect(state.doorsOpen).toBe(false);
    expect(state.stale).toBe(true);
  });
});
