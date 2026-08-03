import { describe, expect, it } from "vitest";
import type { HassEntity } from "../src/types";
import { buildVehicleState, entityDisplayValue, isEntityActive } from "../src/vehicle-state";

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
        climate: entity("on"),
        doors: entity("off"),
      },
      300,
      Date.parse("2026-08-02T10:10:00Z"),
    );

    expect(state.locked).toBe(true);
    expect(state.range).toBe("420 km");
    expect(state.charging).toBe(true);
    expect(state.climateActive).toBe(true);
    expect(state.doorsOpen).toBe(false);
    expect(state.stale).toBe(true);
  });

  it("distinguishes missing or unavailable states from inactive states", () => {
    expect(isEntityActive()).toBeUndefined();
    expect(isEntityActive(entity("unavailable"))).toBeUndefined();
    expect(isEntityActive(entity("off"))).toBe(false);
  });

  it("formats monthly trip metrics when the integration exposes them", () => {
    const state = buildVehicleState(
      {
        trip_distance: entity("312", "km"),
        trip_consumption: entity("4.7", "L/100 km"),
        trip_duration: entity("510", "min"),
      },
      300,
    );

    expect(state.tripDistance).toBe("312 km");
    expect(state.tripConsumption).toBe("4.7 L/100 km");
    expect(state.tripDuration).toBe("510 min");
    expect(state.charging).toBeUndefined();
  });
});
