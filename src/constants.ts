import type { MyHondaPlusCardConfig } from "./types";

export const CARD_TAG = "myhondaplus-vehicle-card";
export const EDITOR_TAG = "myhondaplus-vehicle-card-editor";
export const VERSION = "0.3.0";

export const DEFAULT_CONFIG: Required<
  Pick<
    MyHondaPlusCardConfig,
    | "type"
    | "name"
    | "vehicle_color"
    | "color_preset"
    | "image_mode"
    | "layout"
    | "stale_after"
    | "show_controls"
    | "confirm_unlock"
  >
> = {
  type: `custom:${CARD_TAG}`,
  name: "My Honda+",
  vehicle_color: "#a51d2d",
  color_preset: "rallye_red",
  image_mode: "rendered",
  layout: "full",
  stale_after: 21_600,
  show_controls: true,
  confirm_unlock: true,
};

export const PAINT_PRESETS: Record<string, { label: string; value: string }> = {
  rallye_red: { label: "Rallye Red", value: "#a51d2d" },
  platinum_white: { label: "Platinum White Pearl", value: "#d9dcde" },
  crystal_black: { label: "Crystal Black Pearl", value: "#202326" },
  sonic_grey: { label: "Sonic Grey Pearl", value: "#7f8789" },
  premium_blue: { label: "Premium Crystal Blue", value: "#1f4f7c" },
  silver: { label: "Silver Metallic", value: "#aeb4b8" },
  custom: { label: "Personalizado", value: "#a51d2d" },
};
