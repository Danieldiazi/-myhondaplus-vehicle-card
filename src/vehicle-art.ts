import { html, type TemplateResult } from "lit";
import type { VehicleModelKey } from "./types";

const ROOFLINES: Record<VehicleModelKey, string> = {
  civic: "M270 174 L360 94 Q410 62 495 68 L625 82 Q680 90 735 170",
  hrv: "M250 174 L335 78 Q388 45 486 50 L642 66 Q702 77 758 171",
  crv: "M235 174 L320 62 Q380 30 500 38 L660 55 Q724 70 775 171",
  zrv: "M245 174 L332 72 Q392 40 500 47 L648 63 Q710 76 765 171",
  jazz: "M265 174 L340 82 Q390 53 470 55 L594 65 Q650 75 720 171",
  honda_e: "M285 174 L350 88 Q392 62 470 62 L575 66 Q627 72 692 171",
  eny1: "M240 174 L326 70 Q388 36 500 42 L655 58 Q716 72 770 171",
  generic: "M260 174 L340 82 Q395 50 488 55 L625 68 Q687 78 745 171",
};

export function renderVehicleArt(
  model: VehicleModelKey,
  color: string,
  options: { charging: boolean; climate: boolean; lights: boolean },
): TemplateResult {
  return html`<svg class="vehicle-art" viewBox="0 0 960 360" role="img" aria-label="${model}">
    <defs>
      <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".46"></stop>
        <stop offset=".18" stop-color=${color}></stop>
        <stop offset=".72" stop-color=${color}></stop>
        <stop offset="1" stop-color="#000" stop-opacity=".34"></stop>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#bfe3ef" stop-opacity=".82"></stop>
        <stop offset="1" stop-color="#17242c" stop-opacity=".92"></stop>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="8"></feGaussianBlur></filter>
    </defs>
    <ellipse cx="480" cy="316" rx="350" ry="22" fill="rgba(0,0,0,.22)"></ellipse>
    ${options.climate ? html`<g class="climate-wave" fill="none" stroke="var(--info-color,#42a5f5)" stroke-width="5" opacity=".55"><path d="M390 82q-20-25 0-48"></path><path d="M470 72q-20-25 0-48"></path><path d="M550 82q-20-25 0-48"></path></g>` : null}
    <path
      d="M95 245 Q120 198 210 182 L270 174 ${ROOFLINES[model]} L840 196 Q894 207 915 254 L899 291 L790 300 Q778 235 705 235 Q632 235 620 300 L350 300 Q338 235 265 235 Q192 235 180 300 L87 284 Z"
      fill="url(#paint)"
      stroke="rgba(0,0,0,.45)"
      stroke-width="5"
    ></path>
    <path
      d="M286 170 L365 103 Q404 78 484 80 L612 91 Q662 98 718 170 Z"
      fill="url(#glass)"
      stroke="rgba(255,255,255,.35)"
      stroke-width="4"
    ></path>
    <path d="M482 80 L478 170 M617 92 L650 170" stroke="rgba(8,15,20,.7)" stroke-width="5"></path>
    <path
      d="M126 232 Q182 205 245 201"
      stroke="rgba(255,255,255,.48)"
      stroke-width="7"
      stroke-linecap="round"
    ></path>
    <path
      d="M751 197 Q835 204 876 230"
      stroke="rgba(255,255,255,.34)"
      stroke-width="6"
      stroke-linecap="round"
    ></path>
    ${options.lights ? html`<g class="headlight"><ellipse cx="864" cy="228" rx="28" ry="10" fill="#fff7c2"></ellipse><path d="M880 226 L950 206 L950 248 Z" fill="#fff7c2" opacity=".24" filter="url(#glow)"></path></g>` : null}
    ${options.charging ? html`<g class="charge" transform="translate(730 154)"><circle r="26" fill="var(--success-color,#43a047)" opacity=".92"></circle><path d="M4-18L-10 3H0L-5 19L12-5H2Z" fill="white"></path></g>` : null}
    ${[265, 705].map((cx) => html`<g><circle cx=${cx} cy="288" r="65" fill="#15191c"></circle><circle cx=${cx} cy="288" r="37" fill="#8f979d"></circle><circle cx=${cx} cy="288" r="13" fill="#34393d"></circle></g>`)}
  </svg>`;
}
