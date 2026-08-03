import { html, type TemplateResult } from "lit";
import type { VehicleModelKey } from "./types";
import civicLateralSvg from "../assets/civic-lateral-2.svg?raw";
import hondaLogoSvg from "../assets/honda.svg?raw";

export function renderVehicleArt(model: VehicleModelKey): TemplateResult {
  if (model === "civic") {
    const civicSvg = civicLateralSvg.replace('fill="currentColor"', 'fill="#20252b"');
    const civicImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(civicSvg)}`;

    return html`<img
      class="vehicle-art civic-lateral-art"
      src=${civicImage}
      alt="Honda Civic - vista lateral"
    />`;
  }

  const hondaLogo = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(hondaLogoSvg)}`;
  return html`<img class="vehicle-art honda-logo-art" src=${hondaLogo} alt="Honda" />`;
}
