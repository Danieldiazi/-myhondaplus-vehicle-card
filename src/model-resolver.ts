import type { DeviceRegistryEntry, VehicleModelKey } from "./types";

// Keep specific models before broader matches. For example, e:Ny1 must be
// evaluated before Honda e because both names share the same prefix.
const MODEL_PATTERNS: Array<[VehicleModelKey, RegExp]> = [
  ["civic", /civic/i],
  ["hrv", /\bhr[- ]?v\b/i],
  ["crv", /\bcr[- ]?v\b/i],
  ["zrv", /\bzr[- ]?v\b/i],
  ["jazz", /jazz|fit/i],
  ["eny1", /\be:?ny1\b/i],
  ["honda_e", /honda\s*e\b/i],
];

/**
 * Resolves the visual vehicle family from Home Assistant device metadata.
 *
 * The function intentionally returns a generic fallback so rendering never
 * depends on successful model detection.
 */
export function resolveVehicleModel(device?: DeviceRegistryEntry): VehicleModelKey {
  const haystack = [device?.name_by_user, device?.name, device?.model, device?.manufacturer]
    .filter(Boolean)
    .join(" ");

  return MODEL_PATTERNS.find(([, pattern]) => pattern.test(haystack))?.[0] ?? "generic";
}

/** Returns the user-facing label associated with a visual model key. */
export function vehicleModelLabel(model: VehicleModelKey): string {
  return {
    civic: "Honda Civic",
    hrv: "Honda HR-V",
    crv: "Honda CR-V",
    zrv: "Honda ZR-V",
    jazz: "Honda Jazz",
    honda_e: "Honda e",
    eny1: "Honda e:Ny1",
    generic: "Honda",
  }[model];
}
