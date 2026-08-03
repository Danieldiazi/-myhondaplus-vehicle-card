import type { EntityMap, EntityRegistryEntry } from "./types";

interface Rule {
  domains: string[];
  hints: string[];
  excludes?: string[];
}

export const ENTITY_RULES: Record<keyof EntityMap, Rule> = {
  lock: { domains: ["lock"], hints: ["doors", "door_lock", "lock"] },
  range: { domains: ["sensor"], hints: ["total_range", "range_climate_off", "range"] },
  battery: { domains: ["sensor"], hints: ["battery_level", "ev_battery"] },
  odometer: { domains: ["sensor"], hints: ["odometer", "mileage"] },
  updated: { domains: ["sensor"], hints: ["last_updated", "updated"] },
  climate: { domains: ["switch"], hints: ["climate", "preconditioning"] },
  charging: {
    domains: ["binary_sensor", "sensor", "switch"],
    hints: ["charging", "charge_status", "plugged"],
  },
  refresh: { domains: ["button"], hints: ["refresh_from_car"] },
  refresh_cached: {
    domains: ["button"],
    hints: ["refresh_cached", "refresh"],
    excludes: ["refresh_from_car"],
  },
  horn_lights: { domains: ["button"], hints: ["horn_lights", "horn_and_lights"] },
  location: { domains: ["device_tracker"], hints: ["location", "car_finder"] },
  doors: { domains: ["binary_sensor"], hints: ["doors", "door"] },
  windows: { domains: ["binary_sensor"], hints: ["windows", "window"] },
  trunk: { domains: ["binary_sensor"], hints: ["trunk", "tailgate", "boot"] },
  hood: { domains: ["binary_sensor"], hints: ["hood", "bonnet"] },
  lights: { domains: ["binary_sensor"], hints: ["lights", "headlights"] },
  trip_distance: {
    domains: ["sensor"],
    hints: ["distance_this_month", "trip_distance", "total_distance"],
  },
  trip_consumption: {
    domains: ["sensor"],
    hints: ["avg_consumption_this_month", "average_consumption", "avg_consumption"],
  },
  trip_duration: {
    domains: ["sensor"],
    hints: ["driving_time_this_month", "trip_duration", "driving_time"],
  },
};

const searchableText = (entry: EntityRegistryEntry): string =>
  [entry.entity_id, entry.unique_id, entry.translation_key, entry.original_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export function resolveEntities(
  entries: EntityRegistryEntry[],
  overrides: Partial<EntityMap> = {},
): Partial<EntityMap> {
  const result: Partial<EntityMap> = { ...overrides };

  for (const [key, rule] of Object.entries(ENTITY_RULES) as [keyof EntityMap, Rule][]) {
    if (result[key]) continue;

    const best = entries
      .filter((entry) => entry.platform === "myhondaplus")
      .filter((entry) => !entry.disabled_by)
      .filter((entry) => rule.domains.includes(entry.entity_id.split(".")[0] ?? ""))
      .filter((entry) => {
        const text = searchableText(entry);
        return !(rule.excludes ?? []).some((hint) => text.includes(hint));
      })
      .map((entry) => {
        const text = searchableText(entry);
        const score = rule.hints.reduce(
          (total, hint, index) => total + (text.includes(hint) ? 100 - index : 0),
          0,
        );
        return { entry, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)[0];

    if (best) result[key] = best.entry.entity_id;
  }

  return result;
}
