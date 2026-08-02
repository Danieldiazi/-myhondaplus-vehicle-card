import type { EntityMap, EntityRegistryEntry } from "./types";

interface Rule {
  domains: string[];
  hints: string[];
}

export const ENTITY_RULES: Record<keyof EntityMap, Rule> = {
  lock: { domains: ["lock"], hints: ["doors", "door_lock", "lock"] },
  range: { domains: ["sensor"], hints: ["total_range", "range_climate_off", "range"] },
  battery: { domains: ["sensor"], hints: ["battery_level", "ev_battery", "battery"] },
  odometer: { domains: ["sensor"], hints: ["odometer", "mileage"] },
  updated: { domains: ["sensor"], hints: ["last_updated", "updated"] },
  climate: { domains: ["switch"], hints: ["climate", "preconditioning"] },
  charging: { domains: ["binary_sensor", "sensor", "switch"], hints: ["charging", "charge_status", "plugged"] },
  refresh: { domains: ["button"], hints: ["refresh_from_car"] },
  location: { domains: ["device_tracker"], hints: ["location", "car_finder"] },
  doors: { domains: ["binary_sensor"], hints: ["doors", "door"] },
  windows: { domains: ["binary_sensor"], hints: ["windows", "window"] },
  trunk: { domains: ["binary_sensor"], hints: ["trunk", "tailgate", "boot"] },
  hood: { domains: ["binary_sensor"], hints: ["hood", "bonnet"] },
  lights: { domains: ["binary_sensor"], hints: ["lights", "headlights"] },
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
      .filter((entry) => !entry.disabled_by)
      .filter((entry) => rule.domains.includes(entry.entity_id.split(".")[0] ?? ""))
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
