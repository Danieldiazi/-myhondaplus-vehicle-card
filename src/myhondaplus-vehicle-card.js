const VERSION = "0.2.0";
const DEFAULTS = {
  name: "My Honda+",
  vehicle_color: "#a51d2d",
  image_mode: "rendered",
  layout: "full",
  stale_after: 21600,
  show_controls: true,
  confirm_unlock: true,
};
const RULES = {
  lock: { d: ["lock"], h: ["doors", "door_lock", "lock"] },
  range: { d: ["sensor"], h: ["total_range", "range_climate_off", "range"] },
  battery: { d: ["sensor"], h: ["battery_level", "ev_battery", "battery"] },
  odometer: { d: ["sensor"], h: ["odometer", "mileage"] },
  updated: { d: ["sensor"], h: ["last_updated", "updated"] },
  climate: { d: ["switch"], h: ["climate", "preconditioning"] },
  refresh: { d: ["button"], h: ["refresh_from_car"] },
  location: { d: ["device_tracker"], h: ["location", "car_finder"] },
  doors: { d: ["binary_sensor"], h: ["doors", "door"] },
  windows: { d: ["binary_sensor"], h: ["windows", "window"] },
  trunk: { d: ["binary_sensor"], h: ["trunk", "tailgate", "boot"] },
  hood: { d: ["binary_sensor"], h: ["hood", "bonnet"] },
  lights: { d: ["binary_sensor"], h: ["lights", "headlights"] },
};
const esc = (v) =>
  String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
const color = (v) => (/^#[0-9a-f]{6}$/i.test(v || "") ? v : DEFAULTS.vehicle_color);
class MyHondaPlusVehicleCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("myhondaplus-vehicle-card-editor");
  }
  static getStubConfig() {
    return { type: "custom:myhondaplus-vehicle-card", vehicle_color: DEFAULTS.vehicle_color };
  }
  setConfig(c) {
    if (!c) throw Error("Configuración no válida");
    this.config = { ...DEFAULTS, ...c };
    this.entities = { ...(c.entities || {}) };
    this.loadedDevice = undefined;
    this.render();
  }
  set hass(h) {
    this._hass = h;
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
      const entries = registry.filter((e) => e.device_id === this.config.device && !e.disabled_by);
      for (const [key, r] of Object.entries(RULES)) {
        if (this.entities[key]) continue;
        const m = entries
          .filter((e) => r.d.includes(e.entity_id.split(".")[0]))
          .map((e) => {
            const t =
              `${e.entity_id} ${e.unique_id || ""} ${e.translation_key || ""} ${e.original_name || ""}`.toLowerCase();
            return { e, s: r.h.reduce((n, h, i) => n + (t.includes(h) ? 100 - i : 0), 0) };
          })
          .filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s)[0];
        if (m) this.entities[key] = m.e.entity_id;
      }
      this.render();
    } catch (e) {
      this.loadedDevice = undefined;
      console.warn("My Honda+ Vehicle Card: entity discovery failed", e);
    }
  }
  state(k) {
    const id = this.entities?.[k];
    return id ? this._hass?.states?.[id] : undefined;
  }
  value(k) {
    const e = this.state(k);
    if (!e || ["unknown", "unavailable", "none", "null"].includes(e.state)) return "—";
    const u = e.attributes?.unit_of_measurement;
    return `${esc(e.state)}${u ? ` ${esc(u)}` : ""}`;
  }
  isOn(k) {
    return ["on", "open", "unlocked", "active", "charging", "true"].includes(this.state(k)?.state);
  }
  isLocked() {
    return this.state("lock")?.state === "locked";
  }
  vehicleName() {
    if (this.config.name !== DEFAULTS.name) return esc(this.config.name);
    for (const id of Object.values(this.entities || {})) {
      const n = this._hass?.states?.[id]?.attributes?.friendly_name;
      if (n) return esc(n.replace(/\s+(doors?|range|battery|odometer|location).*$/i, ""));
    }
    return DEFAULTS.name;
  }
  lastUpdated() {
    const e = this.state("updated"),
      raw = e?.state && !["unknown", "unavailable"].includes(e.state) ? e.state : e?.last_updated,
      d = raw ? new Date(raw) : undefined;
    return d && !Number.isNaN(d.getTime()) ? d : undefined;
  }
  age(d) {
    if (!d) return "sin fecha";
    const s = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
    if (s < 60) return "ahora";
    if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
    if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
    return `hace ${Math.floor(s / 86400)} d`;
  }
  moreInfo(id) {
    if (id)
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId: id },
        }),
      );
  }
  async execute(k, service) {
    const id = this.entities?.[k];
    if (!id || !this._hass) return;
    if (k === "location") {
      this.moreInfo(id);
      return;
    }
    const domain = id.split(".")[0];
    let s = service;
    if (!s) {
      if (domain === "button") s = "press";
      else if (domain === "lock") s = this.isLocked() ? "unlock" : "lock";
      else s = this.isOn(k) ? "turn_off" : "turn_on";
    }
    if (
      domain === "lock" &&
      s === "unlock" &&
      this.config.confirm_unlock &&
      !window.confirm("¿Abrir las puertas del vehículo?")
    )
      return;
    await this._hass.callService(domain, s, { entity_id: id });
  }
  carSvg() {
    const c = color(this.config.vehicle_color),
      i = this.cardId;
    return `<svg viewBox="0 0 900 350" role="img" aria-label="Ilustración del vehículo"><defs><linearGradient id="p${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".82"/><stop offset=".43" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".58"/></linearGradient><linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8e3ea"/><stop offset="1" stop-color="#25323b"/></linearGradient></defs><ellipse cx="450" cy="300" rx="330" ry="23" fill="rgba(0,0,0,.18)"/><path d="M90 250c22-55 86-78 177-91l92-72c29-23 83-34 145-29l122 12c48 5 82 27 111 67l54 65c39 9 64 28 74 56l-14 28-88 4c-10-50-46-78-92-78-48 0-84 28-94 78H329c-10-50-46-78-94-78-46 0-82 28-92 78l-62-11z" fill="url(#p${i})" stroke="rgba(0,0,0,.38)" stroke-width="5"/><path d="M286 158l91-66c27-20 68-25 112-22l121 12c37 4 62 22 84 53l25 32z" fill="url(#g${i})" stroke="rgba(255,255,255,.32)" stroke-width="4"/><path d="M389 88l-18 76m135-93 8 93m105-81 27 82" stroke="#20282e" stroke-width="8"/><path d="M130 214c145-31 527-31 678-5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="5"/><circle cx="235" cy="279" r="65" fill="#15181a" stroke="#050607" stroke-width="9"/><circle cx="235" cy="279" r="27" fill="#aab0b4"/><circle cx="670" cy="279" r="65" fill="#15181a" stroke="#050607" stroke-width="9"/><circle cx="670" cy="279" r="27" fill="#aab0b4"/><path d="M764 193l56 16 20 25-68-7z" fill="#f4f7f8"/><path d="M86 244l60-17-18 31-45 3z" fill="#d73333"/></svg>`;
  }
  status(label, k, on = "Abierto", off = "Cerrado") {
    if (!this.state(k)) return "";
    const w = this.isOn(k);
    return `<div class="status ${w ? "warning" : ""}"><span></span><b>${label}</b><small>${w ? on : off}</small></div>`;
  }
  connectedCallback() {
    this.cardId ||= Math.random().toString(36).slice(2);
    if (this._boundClick) return;
    this._boundClick = (e) => {
      const b = e.target.closest("button[data-action]");
      if (!b) return;
      const [k, s] = b.dataset.action.split(":");
      this.execute(k, s || undefined).catch((x) =>
        console.error("My Honda+ Vehicle Card action failed", x),
      );
    };
    this.addEventListener("click", this._boundClick);
  }
  render() {
    if (!this.config) return;
    this.cardId ||= Math.random().toString(36).slice(2);
    const updated = this.lastUpdated(),
      stale = !updated || (Date.now() - updated.getTime()) / 1000 > Number(this.config.stale_after),
      compact = this.config.layout === "compact",
      custom = this.config.image_mode === "custom" && this.config.vehicle_image,
      lock = this.state("lock")?.state,
      lockText =
        lock === "locked" ? "Cerrado" : lock === "unlocked" ? "Desbloqueado" : "Estado desconocido";
    const controls = [
      this.entities.lock
        ? `<button data-action="lock">${this.isLocked() ? "Abrir" : "Cerrar"}</button>`
        : "",
      this.entities.climate ? `<button data-action="climate">Clima</button>` : "",
      this.entities.refresh ? `<button data-action="refresh:press">Actualizar</button>` : "",
      this.entities.location ? `<button data-action="location">Ubicación</button>` : "",
    ].join("");
    this.innerHTML = `<ha-card><style>ha-card{padding:18px;overflow:hidden;color:var(--primary-text-color)}.head{display:flex;justify-content:space-between;gap:12px}.title{font-size:1.2rem;font-weight:600}.sub{font-size:.82rem;color:var(--secondary-text-color);margin-top:3px}.badge{padding:6px 10px;border-radius:999px;background:var(--secondary-background-color);font-size:.76rem;font-weight:600}.badge.alert{color:var(--error-color)}.vehicle{position:relative;min-height:${compact ? "145px" : "215px"};display:flex;align-items:center;justify-content:center}.vehicle svg,.vehicle img{width:100%;max-height:${compact ? "150px" : "230px"};object-fit:contain}.stale{position:absolute;right:2px;bottom:2px;padding:5px 9px;border-radius:999px;background:var(--warning-color,#f4a000);color:#111;font-size:.72rem;font-weight:600}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.metric{padding:10px;border-radius:12px;background:var(--secondary-background-color);min-width:0}.metric small{display:block;color:var(--secondary-text-color)}.metric b{display:block;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.statuses{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:12px}.status{display:grid;grid-template-columns:auto 1fr auto;gap:7px;align-items:center;padding:8px;border:1px solid var(--divider-color);border-radius:10px;font-size:.78rem}.status span{width:8px;height:8px;border-radius:50%;background:var(--success-color,#43a047)}.status.warning span{background:var(--error-color)}.status.warning small{color:var(--error-color)}.controls{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.controls button{border:0;border-radius:12px;padding:11px 5px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer;font:inherit;font-size:.78rem}.setup{padding:18px;border:1px dashed var(--divider-color);border-radius:12px;text-align:center;color:var(--secondary-text-color)}@media(max-width:420px){.statuses{grid-template-columns:1fr}.controls{grid-template-columns:repeat(2,1fr)}}</style><div class="head"><div><div class="title">${this.vehicleName()}</div><div class="sub">Actualizado ${this.age(updated)}</div></div><div class="badge ${lock === "unlocked" ? "alert" : ""}">${lockText}</div></div><div class="vehicle">${custom ? `<img src="${esc(this.config.vehicle_image)}" alt="Vehículo">` : this.carSvg()}${stale ? `<span class="stale">Datos antiguos</span>` : ""}</div>${this.config.device ? `<div class="metrics"><div class="metric"><small>Autonomía</small><b>${this.value("range")}</b></div><div class="metric"><small>Batería</small><b>${this.value("battery")}</b></div><div class="metric"><small>Kilometraje</small><b>${this.value("odometer")}</b></div></div>` : `<div class="setup">Selecciona el vehículo en el editor de la tarjeta.</div>`}${compact ? "" : `<div class="statuses">${this.status("Puertas", "doors")}${this.status("Ventanas", "windows")}${this.status("Maletero", "trunk")}${this.status("Capó", "hood")}${this.status("Luces", "lights", "Encendidas", "Apagadas")}</div>`}${this.config.show_controls && controls ? `<div class="controls">${controls}</div>` : ""}</ha-card>`;
  }
}
class MyHondaPlusVehicleCardEditor extends HTMLElement {
  setConfig(c) {
    this.config = { ...DEFAULTS, ...c };
    this.render();
  }
  set hass(h) {
    this._hass = h;
    this.loadDevices();
    this.render();
  }
  async loadDevices() {
    if (!this._hass || this.loading || this.devices) return;
    this.loading = true;
    try {
      const [d, e] = await Promise.all([
        this._hass.callWS({ type: "config/device_registry/list" }),
        this._hass.callWS({ type: "config/entity_registry/list" }),
      ]);
      const ids = new Set(
        e.filter((x) => x.platform === "myhondaplus" && x.device_id).map((x) => x.device_id),
      );
      this.devices = d
        .filter((x) => ids.has(x.id))
        .sort((a, b) =>
          (a.name_by_user || a.name || "").localeCompare(b.name_by_user || b.name || ""),
        );
    } catch (e) {
      console.warn("My Honda+ Vehicle Card: device discovery failed", e);
      this.devices = [];
    } finally {
      this.loading = false;
      this.render();
    }
  }
  emit() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this.config } },
        bubbles: true,
        composed: true,
      }),
    );
  }
  render() {
    if (!this.config) return;
    const options = (this.devices || [])
      .map(
        (d) =>
          `<option value="${esc(d.id)}" ${this.config.device === d.id ? "selected" : ""}>${esc(d.name_by_user || d.name || d.model || d.id)}</option>`,
      )
      .join("");
    this.innerHTML = `<style>.grid{display:grid;gap:14px;padding:8px 0}label{display:grid;gap:5px;font-size:.9rem}input,select{padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}.row{display:flex;align-items:center;gap:9px}.row input{width:auto}.hint{font-size:.8rem;color:var(--secondary-text-color)}</style><div class="grid"><label>Vehículo<select name="device"><option value="">Selecciona un vehículo My Honda+</option>${options}</select><span class="hint">${this.loading ? "Buscando vehículos…" : `${(this.devices || []).length} vehículo(s) encontrado(s)`}</span></label><label>Nombre<input name="name" value="${esc(this.config.name || "")}"></label><label>Color del coche<input name="vehicle_color" type="color" value="${color(this.config.vehicle_color)}"></label><label>Diseño<select name="layout"><option value="full" ${this.config.layout === "full" ? "selected" : ""}>Completo</option><option value="compact" ${this.config.layout === "compact" ? "selected" : ""}>Compacto</option></select></label><label>Modo de imagen<select name="image_mode"><option value="rendered" ${this.config.image_mode === "rendered" ? "selected" : ""}>Ilustración recoloreable</option><option value="custom" ${this.config.image_mode === "custom" ? "selected" : ""}>Imagen personalizada</option></select></label><label>URL de imagen<input name="vehicle_image" value="${esc(this.config.vehicle_image || "")}" placeholder="/local/coches/mi-civic.png"></label><label class="row"><input name="show_controls" type="checkbox" ${this.config.show_controls ? "checked" : ""}> Mostrar controles</label><label class="row"><input name="confirm_unlock" type="checkbox" ${this.config.confirm_unlock ? "checked" : ""}> Confirmar antes de desbloquear</label></div>`;
    this.querySelectorAll("input,select").forEach((f) =>
      f.addEventListener("change", () => {
        this.config = { ...this.config, [f.name]: f.type === "checkbox" ? f.checked : f.value };
        this.emit();
      }),
    );
  }
}
if (!customElements.get("myhondaplus-vehicle-card"))
  customElements.define("myhondaplus-vehicle-card", MyHondaPlusVehicleCard);
if (!customElements.get("myhondaplus-vehicle-card-editor"))
  customElements.define("myhondaplus-vehicle-card-editor", MyHondaPlusVehicleCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "myhondaplus-vehicle-card"))
  window.customCards.push({
    type: "myhondaplus-vehicle-card",
    name: "My Honda+ Vehicle Card",
    description: "Tarjeta para vehículos conectados mediante My Honda+.",
    preview: true,
  });
console.info(
  `%c MYHONDAPLUS-VEHICLE-CARD %c ${VERSION} `,
  "color:white;background:#a51d2d;font-weight:700",
  "color:#a51d2d;background:white;font-weight:700",
);
