import { resolveEntities } from "./entity-resolver";
import type { DeviceRegistryEntry, EntityMap, EntityRegistryEntry } from "./types";

export interface IntegrationDiscovery {
  integrationDetected: boolean;
  vehicles: DeviceRegistryEntry[];
  selectedDevice?: DeviceRegistryEntry;
  entities: Partial<EntityMap>;
  compatibleEntityCount: number;
}

export function discoverIntegration(
  devices: DeviceRegistryEntry[],
  registryEntries: EntityRegistryEntry[],
  loadedComponents: string[] = [],
  selectedDeviceId?: string,
  overrides: Partial<EntityMap> = {},
): IntegrationDiscovery {
  const integrationEntries = registryEntries.filter((entry) => entry.platform === "myhondaplus");
  const deviceIds = new Set(
    integrationEntries.filter((entry) => entry.device_id).map((entry) => entry.device_id as string),
  );
  const vehicles = devices.filter((device) => deviceIds.has(device.id));
  const selectedDevice = selectedDeviceId
    ? vehicles.find((device) => device.id === selectedDeviceId)
    : undefined;
  const entities = selectedDevice
    ? resolveEntities(
        integrationEntries.filter((entry) => entry.device_id === selectedDevice.id),
        overrides,
      )
    : {};

  return {
    integrationDetected: integrationEntries.length > 0 || loadedComponents.includes("myhondaplus"),
    vehicles,
    selectedDevice,
    entities,
    compatibleEntityCount: Object.values(entities).filter(Boolean).length,
  };
}
