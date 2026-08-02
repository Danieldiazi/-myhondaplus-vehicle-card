import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_TAG, DEFAULT_CONFIG, PAINT_PRESETS } from "./constants";
import { resolveEntities } from "./entity-resolver";
import { resolveVehicleModel, vehicleModelLabel } from "./model-resolver";
import type {
  DeviceRegistryEntry,
  EntityMap,
  EntityRegistryEntry,
  HassEntity,
  HomeAssistant,
  MyHondaPlusCardConfig,
  VehicleModelKey,
} from "./types";
import { renderVehicleArt } from "./vehicle-art";

@customElement(CARD_TAG)
export class MyHondaPlusVehicleCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: MyHondaPlusCardConfig = { ...DEFAULT_CONFIG };
  @state() private entities: Partial<EntityMap> = {};
  @state() private device?: DeviceRegistryEntry;
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
    void this.loadDeviceData();
  }

  private async loadDeviceData(): Promise<void> {
    if (!this.hass || !this.config.device || this.loadedDevice === this.config.device) return;
    this.loadedDevice = this.config.device;
    try {
      const [registry, devices] = await Promise.all([
        this.hass.callWS<EntityRegistryEntry[]>({ type: "config/entity_registry/list" }),
        this.hass.callWS<DeviceRegistryEntry[]>({ type: "config/device_registry/list" }),
      ]);
      this.entities = resolveEntities(
        registry.filter((entry) => entry.device_id === this.config.device),
        this.config.entities,
      );
      this.device = devices.find((device) => device.id === this.config.device);
    } catch (error) {
      this.loadedDevice = undefined;
      console.warn("My Honda+ Vehicle Card: discovery failed", error);
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
    return `${entity.state}${unit ? ` ${String(unit)}` : ""}`;
  }

  private isOn(key: keyof EntityMap): boolean {
    return ["on", "open", "unlocked", "active", "charging", "plugged", "true"].includes(
      this.entity(key)?.state.toLowerCase() ?? "",
    );
  }

  private isLocked(): boolean {
    return this.entity("lock")?.state === "locked";
  }

  private model(): VehicleModelKey {
    return this.config.vehicle_model && this.config.vehicle_model !== "auto"
      ? this.config.vehicle_model
      : resolveVehicleModel(this.device);
  }

  private paintColor(): string {
    const preset = this.config.color_preset ?? DEFAULT_CONFIG.color_preset;
    if (preset !== "custom" && PAINT_PRESETS[preset]) return PAINT_PRESETS[preset].value;
    const custom = this.config.vehicle_color ?? DEFAULT_CONFIG.vehicle_color;
    return /^#[0-9a-f]{6}$/i.test(custom) ? custom : DEFAULT_CONFIG.vehicle_color;
  }

  private ageText(): string {
    const source = this.entity("updated") ?? this.entity("range") ?? this.entity("odometer");
    if (!source) return "Sin fecha de actualización";
    const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(source.last_updated)) / 1000));
    if (seconds < 60) return "Actualizado ahora";
    if (seconds < 3600) return `Actualizado hace ${Math.floor(seconds / 60)} min`;
    return `Actualizado hace ${Math.floor(seconds / 3600)} h`;
  }

  private isStale(): boolean {
    const source = this.entity("updated") ?? this.entity("range") ?? this.entity("odometer");
    if (!source) return false;
    return Date.now() - Date.parse(source.last_updated) > (this.config.stale_after ?? 21_600) * 1000;
  }

  private async execute(key: keyof EntityMap): Promise<void> {
    const entityId = this.entities[key];
    if (!entityId || !this.hass) return;
    if (key === "location") {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId },
        }),
      );
      return;
    }
    const domain = entityId.split(".")[0] ?? "";
    let service = domain === "button" ? "press" : this.isOn(key) ? "turn_off" : "turn_on";
    if (domain === "lock") service = this.isLocked() ? "unlock" : "lock";
    if (
      domain === "lock" &&
      service === "unlock" &&
      this.config.confirm_unlock !== false &&
      !window.confirm("¿Abrir las puertas del vehículo?")
    )
      return;
    await this.hass.callService(domain, service, { entity_id: entityId });
  }

  private metric(icon: string, label: string, key: keyof EntityMap): TemplateResult {
    return html`<div class="metric"><span>${icon}</span><div><small>${label}</small><strong>${this.value(key)}</strong></div></div>`;
  }

  private status(
    icon: string,
    label: string,
    key: keyof EntityMap,
    on = "Abierto",
    off = "Cerrado",
  ): TemplateResult | typeof nothing {
    if (!this.entity(key)) return nothing;
    const active = this.isOn(key);
    return html`<div class="status ${active ? "warning" : ""}"><span class="status-icon">${icon}</span><div><b>${label}</b><small>${active ? on : off}</small></div><i></i></div>`;
  }

  private control(icon: string, label: string, key: keyof EntityMap): TemplateResult | typeof nothing {
    if (!this.entities[key]) return nothing;
    return html`<button type="button" @click=${() => void this.execute(key)}><span>${icon}</span><small>${label}</small></button>`;
  }

  private vehicleVisual(): TemplateResult {
    if (this.config.image_mode === "custom" && this.config.vehicle_image) {
      return html`<img src=${this.config.vehicle_image} alt="Vehículo" loading="lazy" />`;
    }
    return renderVehicleArt(this.model(), this.paintColor(), {
      charging: this.isOn("charging"),
      climate: this.isOn("climate"),
      lights: this.isOn("lights"),
    });
  }

  protected override render(): TemplateResult {
    const lockState = this.entity("lock")?.state;
    const lockText = lockState === "locked" ? "Cerrado" : lockState === "unlocked" ? "Desbloqueado" : "Estado desconocido";
    const modelLabel = vehicleModelLabel(this.model());
    return html`<ha-card class=${this.config.animate === false ? "reduce-motion" : ""}>
      <header>
        <div><h2>${this.config.name}</h2>${this.config.show_model !== false ? html`<p>${modelLabel}</p>` : nothing}</div>
        <span class="badge ${lockState === "unlocked" ? "alert" : ""}">${this.isLocked() ? "🔒" : "🔓"} ${lockText}</span>
      </header>
      <section class="vehicle ${this.isOn("charging") ? "is-charging" : ""}">${this.vehicleVisual()}<div class="freshness ${this.isStale() ? "stale" : ""}">${this.ageText()}</div></section>
      ${this.config.device
        ? html`<section class="metrics">${this.metric("🛣️", "Autonomía", "range")}${this.metric("🔋", "Batería", "battery")}${this.metric("◉", "Kilometraje", "odometer")}</section>`
        : html`<div class="setup">Selecciona el vehículo en el editor.</div>`}
      ${this.config.layout !== "compact"
        ? html`<section class="statuses">${this.status("🚪", "Puertas", "doors")}${this.status("▤", "Ventanas", "windows")}${this.status("▰", "Maletero", "trunk")}${this.status("▱", "Capó", "hood")}${this.status("💡", "Luces", "lights", "Encendidas", "Apagadas")}${this.status("⚡", "Carga", "charging", "Cargando", "Inactiva")}</section>`
        : nothing}
      ${this.config.show_controls !== false
        ? html`<nav class="controls">${this.control(this.isLocked() ? "🔓" : "🔒", this.isLocked() ? "Abrir" : "Cerrar", "lock")}${this.control("❄️", "Clima", "climate")}${this.control("↻", "Actualizar", "refresh")}${this.control("⌖", "Ubicación", "location")}</nav>`
        : nothing}
    </ha-card>`;
  }

  public static override styles = css`
    ha-card{padding:20px;overflow:hidden;color:var(--primary-text-color);background:linear-gradient(145deg,var(--ha-card-background,var(--card-background-color)) 0%,color-mix(in srgb,var(--ha-card-background,var(--card-background-color)) 90%,var(--primary-color) 10%) 100%)}header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}h2{margin:0;font-size:1.25rem;letter-spacing:-.02em}p{margin:4px 0 0;color:var(--secondary-text-color);font-size:.83rem}.badge{padding:7px 11px;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 88%,transparent);height:fit-content;font-size:.76rem;border:1px solid var(--divider-color)}.alert{color:var(--error-color)}.vehicle{position:relative;min-height:235px;display:flex;align-items:center;justify-content:center}.vehicle svg,.vehicle img{width:100%;max-height:250px;object-fit:contain;filter:drop-shadow(0 16px 18px rgba(0,0,0,.12))}.freshness{position:absolute;bottom:7px;left:50%;transform:translateX(-50%);font-size:.72rem;color:var(--secondary-text-color);white-space:nowrap}.freshness.stale{color:var(--warning-color,#f9a825)}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.metric{display:flex;align-items:center;gap:9px;padding:11px;border-radius:14px;background:color-mix(in srgb,var(--secondary-background-color) 86%,transparent);border:1px solid color-mix(in srgb,var(--divider-color) 70%,transparent)}.metric>span{font-size:1.15rem}.metric small{display:block;color:var(--secondary-text-color);font-size:.7rem}.metric strong{display:block;margin-top:3px;font-size:.93rem}.statuses{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:13px}.status{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:9px;padding:9px 10px;border:1px solid var(--divider-color);border-radius:12px;font-size:.78rem}.status-icon{font-size:1rem}.status b,.status small{display:block}.status small{color:var(--secondary-text-color);margin-top:2px}.status i{width:9px;height:9px;border-radius:50%;background:var(--success-color,#43a047);box-shadow:0 0 0 4px color-mix(in srgb,var(--success-color,#43a047) 18%,transparent)}.status.warning i{background:var(--error-color);box-shadow:0 0 0 4px color-mix(in srgb,var(--error-color) 18%,transparent)}.controls{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:15px}button{display:grid;place-items:center;gap:4px;border:1px solid var(--divider-color);border-radius:14px;padding:10px 5px;background:color-mix(in srgb,var(--secondary-background-color) 84%,transparent);color:var(--primary-text-color);cursor:pointer;transition:transform .18s ease,background .18s ease}button:hover{transform:translateY(-2px);background:color-mix(in srgb,var(--secondary-background-color) 70%,var(--primary-color) 30%)}button span{font-size:1.2rem}button small{font-size:.72rem}.setup{padding:18px;border:1px dashed var(--divider-color);border-radius:12px;text-align:center;color:var(--secondary-text-color)}.charge{transform-origin:center;animation:pulse 1.5s ease-in-out infinite}.climate-wave{animation:float 2s ease-in-out infinite}.headlight{animation:glow 1.8s ease-in-out infinite}.reduce-motion *{animation:none!important;transition:none!important}@keyframes pulse{50%{opacity:.55;transform:translate(730px,154px) scale(1.12)}}@keyframes float{50%{transform:translateY(-7px);opacity:.25}}@keyframes glow{50%{opacity:.68}}@media(max-width:520px){ha-card{padding:16px}.vehicle{min-height:190px}.metrics{grid-template-columns:1fr}.statuses{grid-template-columns:1fr}.controls{grid-template-columns:repeat(2,1fr)}}
  `;
}
