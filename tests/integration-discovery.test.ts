import { describe, expect, it } from "vitest";
import { discoverIntegration } from "../src/integration-discovery";
import type { DeviceRegistryEntry, EntityRegistryEntry } from "../src/types";

const vehicle: DeviceRegistryEntry = { id: "vehicle-1", model: "Honda Civic" };
const entry = (
  entity_id: string,
  translation_key: string,
  device_id: string | null = vehicle.id,
): EntityRegistryEntry => ({
  entity_id,
  device_id,
  platform: "myhondaplus",
  translation_key,
  disabled_by: null,
});

describe("integration discovery", () => {
  it("distinguishes an integration that is not loaded", () => {
    const discovery = discoverIntegration([], [], []);
    expect(discovery.integrationDetected).toBe(false);
    expect(discovery.vehicles).toHaveLength(0);
  });

  it("detects a loaded integration before a vehicle is configured", () => {
    const discovery = discoverIntegration([], [], ["myhondaplus"]);
    expect(discovery.integrationDetected).toBe(true);
    expect(discovery.vehicles).toHaveLength(0);
  });

  it("reports a configured vehicle that disappeared", () => {
    const discovery = discoverIntegration(
      [vehicle],
      [entry("sensor.vehicle_range", "total_range")],
      [],
      "missing-vehicle",
    );
    expect(discovery.integrationDetected).toBe(true);
    expect(discovery.selectedDevice).toBeUndefined();
    expect(discovery.compatibleEntityCount).toBe(0);
  });

  it("resolves compatible entities only for the selected vehicle", () => {
    const otherVehicle = { id: "vehicle-2", model: "Honda HR-V" };
    const discovery = discoverIntegration(
      [vehicle, otherVehicle],
      [
        entry("sensor.vehicle_range", "total_range"),
        entry("sensor.other_odometer", "odometer", otherVehicle.id),
      ],
      [],
      vehicle.id,
    );
    expect(discovery.selectedDevice?.id).toBe(vehicle.id);
    expect(discovery.entities.range).toBe("sensor.vehicle_range");
    expect(discovery.entities.odometer).toBeUndefined();
    expect(discovery.compatibleEntityCount).toBe(1);
  });
});
