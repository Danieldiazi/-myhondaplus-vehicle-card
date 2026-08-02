import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_TAG, DEFAULT_CONFIG, PAINT_PRESETS } from "./constants";
import { resolveEntities } from "./entity-resolver";
import type { EntityMap, EntityRegistryEntry, HassEntity, HomeAssistant, MyHondaPlusCardConfig } from "./types";

@customElement(CARD_TAG)
export class MyHondaPlusVehicleCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: MyHondaPlusCardConfig = { ...DEFAULT_CONFIG };
  @state() private entities: Partial<EntityMap> = {};
  private loadedDevice?: string;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./editor");
    return document.createElement("myhondaplus-vehicle-card-editor");
  }

  public static getStubConfig(): MyHondaPlusCardConfig {
    return { ...DEFAULT_CONFIG };
  }

  public setConfig(config: MyHondaPlusCardConfig): void {
    if (!config) throw new Error("La configuración es obligatoria");
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.entities = { ...(config.entities ?? {}) };
    this.loadedDevice = undefined;
  }

  public getCardSize(): number {
    return this.config.layout === "compact" ? 3 : 6;
  }

  protected override updated(): void {
    void this.loadEntities();
  }

  private async loadEntities(): Promise<void> {
    if (!this.hass || !this.config.device || this.loadedDevice === this.config.device) return;
    this.loadedDevice = this.config.device;
    try {
      const registry = await this.hass.callWS<EntityRegistryEntry[]>({ type: "config/entity_registry/list" });
      this.entities = resolveEntities(
        registry.filter((entry) => entry.device_id === this.config.device),
        this.config.entities,
      );
    } catch (error) {
      this.loadedDevice = undefined;
      console.warn("My Honda+ Vehicle Card: entity discovery failed", error);
    }
  }

  private entity(key: keyof EntityMap): HassEntity | undefined {
    const id = this.entities[key];
    return id ? this.hass?.states[id] : undefined;
  }

  private value(key: keyof EntityMap): string {
    const entity = this.entity(key);
    if (!entity || ["unknown", "unavailable", "none"].includes(entity.state)) return "—";
    const unit = entity.attributes.unit_of_measurement;
    return `${entity.state}${unit ? ` ${unit}` : ""}`;
  }

  private isOn(key: keyof EntityMap): boolean {
    return ["on", "open", "unlocked", "active", "charging", "true"].includes(this.entity(key)?.state ?? "");
  }

  private isLocked(): boolean {
    return this.entity("lock")?.state === "locked";
  }

  private paintColor(): string {
    const preset = this.config.color_preset ?? DEFAULT_CONFIG.color_preset;
    if (preset !== "custom" && PAINT_PRESETS[preset]) return PAINT_PRESETS[preset].value;
    const custom = this.config.vehicle_color ?? DEFAULT_CONFIG.vehicle_color;
    return /^#[0-9a-f]{6}$/i.test(custom) ? custom : DEFAULT_CONFIG.vehicle_color;
  }

  private async execute(key: keyof EntityMap): Promise<void> {
    const entityId = this.entities[key];
    if (!entityId || !this.hass) return;
    if (key === "location") {
      this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId } }));
      return;
    }
    const domain = entityId.split(".")[0] ?? "";
    let service = domain === "button" ? "press" : this.isOn(key) ? "turn_off" : "turn_on";
    if (domain === "lock") service = this.isLocked() ? "unlock" : "lock";
    if (domain === "lock" && service === "unlock" && this.config.confirm_unlock !== false && !window.confirm("¿Abrir las puertas del vehículo?")) return;
    await this.hass.callService(domain, service, { entity_id: entityId });
  }

  private metric(label: string, key: keyof EntityMap): TemplateResult {
    return html`<div class="metric"><small>${label}</small><strong>${this.value(key)}</strong></div>`;
  }

  private status(label: string, key: keyof EntityMap, on = "Abierto", off = "Cerrado"): TemplateResult | typeof nothing {
    if (!this.entity(key)) return nothing;
    const active = this.isOn(key);
    return html`<div class="status ${active ? "warning" : ""}"><span></span><b>${label}</b><small>${active ? on : off}</small></div>`;
  }

  private control(label: string, key: keyof EntityMap): TemplateResult | typeof nothing {
    if (!this.entities[key]) return nothing;
    return html`<button type="button" @click=${() => void this.execute(key)}>${label}</button>`;
  }

  private vehicleArt(): TemplateResult {
    if (this.config.image_mode === "custom" && this.config.vehicle_image) {
      return html`<img src=${this.config.vehicle_image} alt="Vehículo" loading="lazy" />`;
    }
    const color = this.paintColor();
    return html`<svg viewBox="0 0 900 350" role="img" aria-label="Ilustración del vehículo">
      <ellipse cx="450" cy="300" rx="330" ry="23" fill="rgba(0,0,0,.18)"></ellipse>
      <path d="M90 250c22-55 86-78 177-91l92-72c29-23 83-34 145-29l122 12c48 5 82 27 111 67l54 65c39 9 64 28 74 56l-14 28-88 4c-10-50-46-78-92-78-48 0-84 28-94 78H329c-10-50-46-78-94-78-46 0-82 28-92 78l-62-11z" fill=${color} stroke="rgba(0,0,0,.38)" stroke-width="5"></path>
      <circle cx="235" cy="279" r="65" fill="#15181a"></circle><circle cx="235" cy="279" r="27" fill="#aab0b4"></circle>
      <circle cx="670" cy="279" r="65" fill="#15181a"></circle><circle cx="670" cy="279" r="27" fill="#aab0b4"></circle>
    </svg>`;
  }

  protected override render(): TemplateResult {
    const lockState = this.entity("lock")?.state;
    const lockText = lockState === "locked" ? "Cerrado" : lockState === "unlocked" ? "Desbloqueado" : "Estado desconocido";
    return html`<ha-card>
      <header><div><h2>${this.config.name}</h2><p>${this.config.device ? "Vehículo conectado" : "Selecciona un vehículo"}</p></div><span class="badge ${lockState === "unlocked" ? "alert" : ""}">${lockText}</span></header>
      <section class="vehicle">${this.vehicleArt()}</section>
      ${this.config.device ? html`<section class="metrics">${this.metric("Autonomía", "range")}${this.metric("Batería", "battery")}${this.metric("Kilometraje", "odometer")}</section>` : html`<div class="setup">Selecciona el vehículo en el editor.</div>`}
      ${this.config.layout !== "compact" ? html`<section class="statuses">${this.status("Puertas", "doors")}${this.status("Ventanas", "windows")}${this.status("Maletero", "trunk")}${this.status("Capó", "hood")}${this.status("Luces", "lights", "Encendidas", "Apagadas")}</section>` : nothing}
      ${this.config.show_controls !== false ? html`<nav class="controls">${this.control(this.isLocked() ? "Abrir" : "Cerrar", "lock")}${this.control("Clima", "climate")}${this.control("Actualizar", "refresh")}${this.control("Ubicación", "location")}</nav>` : nothing}
    </ha-card>`;
  }

  public static override styles = css`
    ha-card{padding:18px;overflow:hidden;color:var(--primary-text-color)}header{display:flex;justify-content:space-between;gap:12px}h2{margin:0;font-size:1.2rem}p{margin:3px 0 0;color:var(--secondary-text-color);font-size:.82rem}.badge{padding:6px 10px;border-radius:999px;background:var(--secondary-background-color);height:fit-content;font-size:.76rem}.alert{color:var(--error-color)}.vehicle{min-height:210px;display:flex;align-items:center}.vehicle svg,.vehicle img{width:100%;max-height:230px;object-fit:contain}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.metric{padding:10px;border-radius:12px;background:var(--secondary-background-color)}.metric small{display:block;color:var(--secondary-text-color)}.metric strong{display:block;margin-top:4px}.statuses{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:12px}.status{display:grid;grid-template-columns:auto 1fr auto;gap:7px;padding:8px;border:1px solid var(--divider-color);border-radius:10px;font-size:.78rem}.status span{width:8px;height:8px;border-radius:50%;background:var(--success-color,#43a047)}.warning span{background:var(--error-color)}.controls{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}button{border:0;border-radius:12px;padding:11px 5px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}.setup{padding:18px;border:1px dashed var(--divider-color);border-radius:12px;text-align:center;color:var(--secondary-text-color)}@media(max-width:420px){.statuses{grid-template-columns:1fr}.controls{grid-template-columns:repeat(2,1fr)}}
  `;
}
