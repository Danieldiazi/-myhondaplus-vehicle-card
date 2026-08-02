import "./card";
import { CARD_TAG, VERSION } from "./constants";

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards ??= [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "My Honda+ Vehicle Card",
    description: "Tarjeta visual para vehículos conectados mediante My Honda+.",
    preview: true,
    documentationURL: "https://github.com/Danieldiazi/myhondaplus-vehicle-card",
  });
}

console.info(
  `%c MYHONDAPLUS-VEHICLE-CARD %c ${VERSION} `,
  "color:white;background:#a51d2d;font-weight:700",
  "color:#a51d2d;background:white;font-weight:700",
);
