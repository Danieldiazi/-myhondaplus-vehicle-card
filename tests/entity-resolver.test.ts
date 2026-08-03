import { describe, expect, it } from "vitest";
import { resolveEntities } from "../src/entity-resolver";
import type { EntityRegistryEntry } from "../src/types";

const entry = (entity_id: string, translation_key?: string): EntityRegistryEntry => ({
  entity_id,
  device_id: "vehicle",
  platform: "myhondaplus",
  translation_key,
  disabled_by: null,
});

describe("resolveEntities", () => {
  it("matches entities by domain and translation key", () => {
    const result = resolveEntities([
      entry("sensor.civic_battery", "battery_level"),
      entry("lock.civic", "doors"),
      entry("button.civic_refresh", "refresh_from_car"),
    ]);
    expect(result.battery).toBe("sensor.civic_battery");
    expect(result.lock).toBe("lock.civic");
    expect(result.refresh).toBe("button.civic_refresh");
  });

  it("does not confuse a sensor with a lock", () => {
    const result = resolveEntities([entry("sensor.door_lock_status", "door_lock")]);
    expect(result.lock).toBeUndefined();
  });

  it("preserves explicit overrides", () => {
    const result = resolveEntities([entry("sensor.detected_range", "range")], {
      range: "sensor.manual_range",
    });
    expect(result.range).toBe("sensor.manual_range");
  });

  it("ignores similarly named entities from other integrations", () => {
    const foreign = entry("sensor.phone_battery", "battery_level");
    foreign.platform = "mobile_app";
    expect(resolveEntities([foreign]).battery).toBeUndefined();
  });

  it("does not treat a generic 12 V battery name as traction battery data", () => {
    expect(resolveEntities([entry("sensor.civic_battery", "battery")]).battery).toBeUndefined();
  });

  it("detects trip metrics and separates both refresh buttons", () => {
    const result = resolveEntities([
      entry("sensor.civic_month_distance", "distance_this_month"),
      entry("sensor.civic_consumption", "avg_consumption_this_month"),
      entry("button.civic_refresh", "refresh"),
      entry("button.civic_refresh_from_car", "refresh_from_car"),
      entry("button.civic_horn", "horn_lights"),
    ]);

    expect(result.trip_distance).toBe("sensor.civic_month_distance");
    expect(result.trip_consumption).toBe("sensor.civic_consumption");
    expect(result.refresh_cached).toBe("button.civic_refresh");
    expect(result.refresh).toBe("button.civic_refresh_from_car");
    expect(result.horn_lights).toBe("button.civic_horn");
  });
});
