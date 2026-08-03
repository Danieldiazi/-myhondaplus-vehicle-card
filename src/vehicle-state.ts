import type { EntityMap, HassEntity, VehicleState } from "./types";

const ACTIVE_STATES = new Set(["on", "open", "unlocked", "active", "charging", "plugged", "true"]);
const UNAVAILABLE_STATES = new Set(["unknown", "unavailable", "none"]);

export function isEntityActive(entity?: HassEntity): boolean | undefined {
  if (!entity || UNAVAILABLE_STATES.has(entity.state.toLowerCase())) return undefined;
  return ACTIVE_STATES.has(entity.state.toLowerCase());
}

export function entityDisplayValue(entity?: HassEntity): string {
  if (!entity || UNAVAILABLE_STATES.has(entity.state.toLowerCase())) return "—";
  const unit = entity.attributes.unit_of_measurement;
  return `${entity.state}${unit ? ` ${String(unit)}` : ""}`;
}

export function entityAgeSeconds(entity?: HassEntity, now = Date.now()): number | undefined {
  if (!entity) return undefined;
  const updated = Date.parse(entity.last_updated);
  return Number.isFinite(updated) ? Math.max(0, Math.floor((now - updated) / 1000)) : undefined;
}

/**
 * Converts Home Assistant entities into a presentation-independent vehicle state.
 * Keeping this translation outside the Lit component makes status logic testable and
 * provides a stable boundary for future vehicle providers.
 */
export function buildVehicleState(
  entities: Partial<Record<keyof EntityMap, HassEntity | undefined>>,
  staleAfterSeconds: number,
  now = Date.now(),
): VehicleState {
  const freshnessSource = entities.updated ?? entities.range ?? entities.odometer;
  const ageSeconds = entityAgeSeconds(freshnessSource, now);

  return {
    locked: entities.lock ? entities.lock.state === "locked" : undefined,
    range: entityDisplayValue(entities.range),
    battery: entityDisplayValue(entities.battery),
    odometer: entityDisplayValue(entities.odometer),
    tripDistance: entityDisplayValue(entities.trip_distance),
    tripConsumption: entityDisplayValue(entities.trip_consumption),
    tripDuration: entityDisplayValue(entities.trip_duration),
    climateActive: isEntityActive(entities.climate),
    charging: isEntityActive(entities.charging),
    doorsOpen: isEntityActive(entities.doors),
    windowsOpen: isEntityActive(entities.windows),
    trunkOpen: isEntityActive(entities.trunk),
    hoodOpen: isEntityActive(entities.hood),
    lightsOn: isEntityActive(entities.lights),
    ageSeconds,
    stale: ageSeconds !== undefined && ageSeconds > staleAfterSeconds,
  };
}
