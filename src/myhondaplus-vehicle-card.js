const VERSION = "0.1.0";

const DEFAULTS = {
  name: "My Honda+",
  vehicle_color: "#a51d2d",
  image_mode: "rendered",
  layout: "full",
  stale_after: 21600,
  show_controls: true,
  confirm_unlock: true,
};

const HINTS = {
  lock: ["lock", "doors"],
  range: ["total_range", "range_climate_off", "range"],
  battery: ["battery_level", "battery"],
  odometer: ["odometer"],
  updated: ["last_updated", "updated"],
  climate: ["climate", "preconditioning"],
  refresh: ["refresh_from_car"],
  location: ["location"],
  doors: ["doors"],
  windows: ["windows"],
  trunk: ["trunk", "tailgate"],
  hood: ["hood", "bonnet"],
  lights: ["lights", "headlights"],
};

class MyHondaPlusVehicleCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("myhondaplus-vehicle-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:myhondaplus-vehicle-card", vehicle_color: "#a51d2d" };
  }

  setConfig(config) {
    if (!config) throw new Error("Configuración no válida");
    this.config = { ...DEFAULTS, ...config };
    this.entities = { ...(config.entities || {}) };
    this.loadedDevice = undefined;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.loadRegistry();
    this.render();
  }

  getCardSize() {
    return this.config?.layout === "compact" ? 3 : 6;
  }

  async loadRegistry() {
    if (!this._hass || !this.config?.device || this.loadedDevice === this.config.device) return;
    this.loadedDevice = this.config.device;
    try {
      const registry = await this._hass.callWS({ type: "config/entity_registry/list" });
      const entries = registry.filter((entry) => entry.device_id === this.config.device && !entry.disabled_by);
      for (const [key, hints] of Object.entries(HINTS)) {
        if (this.entities[key]) continue;
        const match = entries
          .map((entry) => {
            const text = `${entry.entity_id} ${entry.unique_id || ""} ${entry.translation_key || ""} ${entry.original_name || ""}`.toLowerCase();
            const score = hints.reduce((total, hint, index) => total + (text.includes(hint) ? 100 - index : 0), 0);
            return { entry, score };
          })
          .filter((candidate) => candidate.score > 0)
          .sort((a, b) => b.score - a.score)[0];
        if (match) this.entities[key] = match.entry.entity_id;
      }
      this.render();
    } catch (error) {
      console.warn("My Honda+ Vehicle Card: entity discovery failed", error);
    }
  }

  state(key) {
    const entityId = this.entities?.[key];
    return entityId ? this._hass?.states?.[entityId] : undefined;
  }

  value(key) {
    const entity = this.state(key);
    if (!entity || ["unknown", "unavailable", "none"].includes(entity.state)) return "—";
    const unit = entity.attributes?.unit_of_measurement;
    return `${entity.state}${unit ? ` ${unit}` : ""}`;
  }

  active(key) {
    return ["on", "open", "unlocked", "active", "charging", "true"].includes(this.state(key)?.state);
  }

  vehicleName() {
    if (this.config.name !== DEFAULTS.name) return this.config.name;
    for (const entityId of Object.values(this.entities || {})) {
      const name = this._hass?.states?.[entityId]?.attributes?.friendly_name;
      if (name) return name.replace(/\s+(doors?|range|battery|odometer|location).*$/i, "");
    }
    return DEFAULTS.name;
  }

  lastUpdated() {
    const entity = this.state("updated");
    const raw = entity?.state && !["unknown", "unavailable"].includes(entity.state)
      ? entity.state
      : entity?.last_updated;
    const date = raw ? new Date(raw) : undefined;
    return date && !Number.isNaN(date.getTime()) ? date : undefined;
  }

  age(date) {
    if (!date) return "sin fecha";
    const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return "ahora";
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} h`;
    return `hace ${Math.floor(seconds / 86400)} d`;
  }

  async call(key, service) {
    const entityId = this.entities?.[key];
    if (!entityId || !this._hass) return;
    const [domain] = entityId.split(".");
    let targetService = service;
    if (!targetService) {
      if (domain === "button") targetService = "press";
      else if (domain === "lock") targetService = this.active(key) ? "lock" : "unlock";
      else targetService = this.active(key) ? "turn_off" : "turn_on";
    }
    if (domain === "lock" && targetService === "unlock" && this.config.confirm_unlock) {
      if (!window.confirm("¿Abrir las puertas del vehículo?")) return;
    }
    await this._hass.callService(domain, targetService, { entity_id: entityId });
  }

  carSvg() {
    const color = this.config.vehicle_color;
    return `<svg viewBox="0 0 900 350" role="img" aria-label="Ilustración del vehículo">
      <defs>
        <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${color}" stop-opacity=".88"/>
          <stop offset=".48" stop-color="${color}"/>
          <stop offset="1" stop-color="${color}" stop-opacity=".64"/>
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d8e3ea"/><stop offset="1" stop-color="#25323b"/>
        </linearGradient>
      </defs>
      <ellipse cx="450" cy="300" rx="330" ry="23" fill="rgba(0,0,0,.18)"/>
      <path d="M90 250c22-55 86-78 177-91l92-72c29-23 83-34 145-29l122 12c48 5 82 27 111 67l54 65c39 9 64 28 74 56l-14 28-88 4c-10-50-46-78-92-78-48 0-84 28-94 78H329c-10-50-46-78-94-78-46 0-82 28-92 78l-62-11z" fill="url(#paint)" stroke="rgba(0,0,0,.38)" stroke-width="5"/>
      <path d="M286 158l91-66c27-20 68-25 112-22l121 12c37 4 62 22 84 53l25 32z" fill="url(#glass)" stroke="rgba(255,255,255,.32)" stroke-width="4"/>
      <path d="M389 88l-18 76m135-93 8 93m105-81 27 82" stroke="#20282e" stroke-width="8"/>
      <path d="M130 214c145-31 527-31 678-5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="5"/>
      <circle cx="235" cy="279" r="65" fill="#15181a" stroke="#050607" stroke-width="9"/><circle cx="235" cy="279" r="27" fill="#aab0b4"/>
      <circle cx="670" cy="279" r="65" fill="#15181a" stroke="#050607" stroke-width="9"/><circle cx="670" cy="279" r="27" fill="#aab0b4"/>
      <path d="M764 193l56 16 20 25-68-7z" fill="#f4f7f8"/><path d="M86 244l60-17-18 31-45 3z" fill="#d73333"/>
    </svg>`;
  }

  status(label, key) {
    if (!this.state(key)) return "";
    const warning = this.active(key);
    return `<div class="status ${warning ? "warning" : ""}"><span></span><b>${label}</b><small>${warning ? "Abierto" : "Cerrado"}</small></div>`;
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const [key, service] = button.dataset.action.split(":");
      this.call(key, service || undefined);
    });
  }

  render() {
    if (!this.config) return;
    const updated = this.lastUpdated();
    const stale = !updated || (Date.now() - updated.getTime()) / 1000 > Number(this.config.stale_after);
    const compact = this.config.layout === "compact";
    const customImage = this.config.image_mode === "custom" && this.config.vehicle_image;
    const controls = [
      this.entities.lock ? `<button data-action="lock">${this.active("lock") ? "Cerrar" : "Abrir"}</button>` : "",
      this.entities.climate ? `<button data-action="climate">Clima</button>` : "",
      this.entities.refresh ? `<button data-action="refresh:press">Actualizar</button>` : "",
      this.entities.location ? `<button data-action="location">Ubicación</button>` : "",
    ].join("");

    this.innerHTML = `<ha-card>
      <style>
        ha-card{padding:18px;overflow:hidden;color:var(--primary-text-color)}
        .head{display:flex;justify-content:space-between;gap:12px}.title{font-size:1.2rem;font-weight:600}.sub{font-size:.82rem;color:var(--secondary-text-color);margin-top:3px}.badge{padding:6px 10px;border-radius:999px;background:var(--secondary-background-color);font-size:.76rem;font-weight:600}.badge.alert{color:var(--error-color)}
        .vehicle{position:relative;min-height:${compact ? "145px" : "215px"};display:flex;align-items:center;justify-content:center}.vehicle svg,.vehicle img{width:100%;max-height:${compact ? "150px" : "230px"};object-fit:contain}.stale{position:absolute;right:2px;bottom:2px;padding:5px 9px;border-radius:999px;background:var(--warning-color,#f4a000);color:#111;font-size:.72rem;font-weight:600}
        .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.metric{padding:10px;border-radius:12px;background:var(--secondary-background-color);min-width:0}.metric small{display:block;color:var(--secondary-text-color)}.metric b{display:block;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .statuses{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:12px}.status{display:grid;grid-template-columns:auto 1fr auto;gap:7px;align-items:center;padding:8px;border:1px solid var(--divider-color);border-radius:10px;font-size:.78rem}.status span{width:8px;height:8px;border-radius:50%;background:var(--success-color,#43a047)}.status.warning span{background:var(--error-color)}.status.warning small{color:var(--error-color)}
        .controls{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.controls button{border:0;border-radius:12px;padding:11px 5px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer;font:inherit;font-size:.78rem}.controls button:hover{background:var(--divider-color)}
        @media(max-width:420px){.statuses{grid-template-columns:1fr}.controls{grid-template-columns:repeat(2,1fr)}}
      </style>
      <div class="head"><div><div class="title">${this.vehicleName()}</div><div class="sub">Actualizado ${this.age(updated)}</div></div><div class="badge ${this.active("lock") ? "alert" : ""}">${this.active("lock") ? "Desbloqueado" : "Cerrado"}</div></div>
      <div class="vehicle">${customImage ? `<img src="${this.config.vehicle_image}" alt="Vehículo">` : this.carSvg()}${stale ? `<span class="stale">Datos antiguos</span>` : ""}</div>
      <div class="metrics"><div class="metric"><small>Autonomía</small><b>${this.value("range")}</b></div><div class="metric"><small>Batería</small><b>${this.value("battery")}</b></div><div class="metric"><small>Kilometraje</small><b>${this.value("odometer")}</b></div></div>
      ${compact ? "" : `<div class="statuses">${this.status("Puertas", "doors")}${this.status("Ventanas", "windows")}${this.status("Maletero", "trunk")}${this.status("Capó", "hood")}${this.status("Luces", "lights")}</div>`}
      ${this.config.show_controls ? `<div class="controls">${controls}</div>` : ""}
    </ha-card>`;
  }
}

class MyHondaPlusVehicleCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = { ...DEFAULTS, ...config };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this.config) return;
    this.innerHTML = `<style>.grid{display:grid;gap:14px;padding:8px 0}label{display:grid;gap:5px;font-size:.9rem}input,select{padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}</style><div class="grid">
      <label>Nombre<input name="name" value="${this.config.name || ""}"></label>
      <label>ID del dispositivo<input name="device" value="${this.config.device || ""}" placeholder="Device ID"></label>
      <label>Color del coche<input name="vehicle_color" type="color" value="${this.config.vehicle_color}"></label>
      <label>Diseño<select name="layout"><option value="full" ${this.config.layout === "full" ? "selected" : ""}>Completo</option><option value="compact" ${this.config.layout === "compact" ? "selected" : ""}>Compacto</option></select></label>
      <label>Modo de imagen<select name="image_mode"><option value="rendered" ${this.config.image_mode === "rendered" ? "selected" : ""}>Ilustración recoloreable</option><option value="custom" ${this.config.image_mode === "custom" ? "selected" : ""}>Imagen personalizada</option></select></label>
      <label>URL de imagen<input name="vehicle_image" value="${this.config.vehicle_image || ""}" placeholder="/local/coches/mi-civic.png"></label>
    </div>`;
    this.querySelectorAll("input,select").forEach((field) => field.addEventListener("change", () => {
      const value = field.type === "checkbox" ? field.checked : field.value;
      this.config = { ...this.config, [field.name]: value };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
    }));
  }
}

customElements.define("myhondaplus-vehicle-card", MyHondaPlusVehicleCard);
customElements.define("myhondaplus-vehicle-card-editor", MyHondaPlusVehicleCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "myhondaplus-vehicle-card",
  name: "My Honda+ Vehicle Card",
  description: "Tarjeta para vehículos conectados mediante My Honda+.",
  preview: true,
});
console.info(`%c MYHONDAPLUS-VEHICLE-CARD %c ${VERSION} `, "color:white;background:#a51d2d;font-weight:700", "color:#a51d2d;background:white;font-weight:700");
