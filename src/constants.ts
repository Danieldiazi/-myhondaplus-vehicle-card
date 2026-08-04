import type { MyHondaPlusCardConfig } from "./types";

export const CARD_TAG = "myhondaplus-vehicle-card";
export const EDITOR_TAG = "myhondaplus-vehicle-card-editor";
export const VERSION = __CARD_VERSION__;

export const DEFAULT_CONFIG: Required<
  Pick<
    MyHondaPlusCardConfig,
    | "type"
    | "name"
    | "vehicle_color"
    | "color_preset"
    | "image_mode"
    | "vehicle_model"
    | "vehicle_scale"
    | "vehicle_alignment"
    | "vehicle_shadow"
    | "shadow_intensity"
    | "layout"
    | "stale_after"
    | "show_controls"
    | "show_model"
    | "animate"
    | "confirm_unlock"
    | "locale"
    | "debug"
    | "controls"
    | "metrics"
  >
> = {
  type: `custom:${CARD_TAG}`,
  name: "My Honda+",
  vehicle_color: "#a51d2d",
  color_preset: "rallye_red",
  image_mode: "rendered",
  vehicle_model: "auto",
  vehicle_scale: 100,
  vehicle_alignment: "center",
  vehicle_shadow: true,
  shadow_intensity: 60,
  layout: "full",
  stale_after: 21_600,
  show_controls: true,
  show_model: true,
  animate: true,
  confirm_unlock: true,
  locale: "auto",
  debug: false,
  controls: ["lock", "climate", "horn_lights", "refresh"],
  metrics: ["range", "battery", "odometer", "trip_distance", "trip_consumption"],
};

export const PAINT_PRESETS: Record<string, { label: string; value: string; accent: string }> = {
  rallye_red: { label: "Rallye Red", value: "#a51d2d", accent: "#ef8a92" },
  platinum_white: { label: "Platinum White Pearl", value: "#d9dcde", accent: "#ffffff" },
  crystal_black: { label: "Crystal Black Pearl", value: "#202326", accent: "#70777d" },
  sonic_grey: { label: "Sonic Grey Pearl", value: "#7f8789", accent: "#cbd0d1" },
  urban_grey: { label: "Urban Grey Pearl", value: "#6e706d", accent: "#b8bab5" },
  premium_blue: { label: "Premium Crystal Blue", value: "#1f4f7c", accent: "#74a9dd" },
  canyon_river_blue: { label: "Canyon River Blue", value: "#35566f", accent: "#89a9bf" },
  silver: { label: "Silver Metallic", value: "#aeb4b8", accent: "#eef1f3" },
  custom: { label: "Personalizado", value: "#a51d2d", accent: "#ef8a92" },
};
