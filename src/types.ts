export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
  language?: string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    unit_of_measurement?: string;
  };
  last_updated: string;
}

export interface EntityRegistryEntry {
  entity_id: string;
  device_id: string | null;
  platform?: string;
  unique_id?: string;
  translation_key?: string | null;
  original_name?: string | null;
  disabled_by?: string | null;
}

export interface DeviceRegistryEntry {
  id: string;
  name?: string;
  name_by_user?: string | null;
  model?: string | null;
  manufacturer?: string | null;
}

export type CardLayout = "full" | "compact";
export type ImageMode = "rendered" | "custom";

export interface MyHondaPlusCardConfig {
  type: string;
  device?: string;
  name?: string;
  vehicle_color?: string;
  color_preset?: string;
  image_mode?: ImageMode;
  vehicle_image?: string;
  layout?: CardLayout;
  stale_after?: number;
  show_controls?: boolean;
  confirm_unlock?: boolean;
  entities?: Partial<EntityMap>;
}

export interface EntityMap {
  lock: string;
  range: string;
  battery: string;
  odometer: string;
  updated: string;
  climate: string;
  refresh: string;
  location: string;
  doors: string;
  windows: string;
  trunk: string;
  hood: string;
  lights: string;
}
