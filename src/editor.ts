import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DEFAULT_CONFIG, EDITOR_TAG, PAINT_PRESETS } from "./constants";
import type { DeviceRegistryEntry, EntityRegistryEntry, HomeAssistant, MyHondaPlusCardConfig } from "./types";

@customElement(EDITOR_TAG)
export class MyHondaPlusVehicleCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: MyHondaPlusCardConfig = { ...DEFAULT_CONFIG };
  @state() private devices: DeviceRegistryEntry[] = [];
  @state() private loading = false;

  public setConfig(config: MyHondaPlusCardConfig): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) void this.loadDevices();
  }

  private async loadDevices(): Promise<void> {
    if (!this.hass || this.loading) return;
    this.loading = true;
    try {
      const [devices, entities] = await Promise.all([
        this.hass.callWS<DeviceRegistryEntry[]>({ type: "config/device_registry/list" }),
        this.hass.callWS<EntityRegistryEntry[]>({ type: "config/entity_registry/list" }),
      ]);
      const ids = new Set(
        entities
          .filter((entity) => entity.platform === "myhondaplus" && entity.device_id)
          .map((entity) => entity.device_id as string),
      );
      this.devices = devices
        .filter((device) => ids.has(device.id))
        .sort((a, b) => this.deviceName(a).localeCompare(this.deviceName(b)));
    } catch (error) {
      console.warn("My Honda+ Vehicle Card: device discovery failed", error);
      this.devices = [];
    } finally {
      this.loading = false;
    }
  }

  private deviceName(device: DeviceRegistryEntry): string {
    return device.name_by_user ?? device.name ?? device.model ?? device.id;
  }

  private updateField(event: Event): void {
    const target = event.currentTarget as HTMLInputElement | HTMLSelectElement;
    let value: string | boolean | number = target.value;
    if (target instanceof HTMLInputElement && target.type === "checkbox") value = target.checked;
    if (target.name === "stale_after") value = Number(target.value);

    const config = { ...this.config, [target.name]: value };
    if (target.name === "color_preset" && value !== "custom") {
      config.vehicle_color = PAINT_PRESETS[String(value)]?.value ?? config.vehicle_color;
    }
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override render(): TemplateResult {
    return html`<div class="grid">
      <label>Vehículo
        <select name="device" @change=${this.updateField}>
          <option value="">Selecciona un vehículo My Honda+</option>
          ${this.devices.map((device) => html`<option value=${device.id} ?selected=${this.config.device === device.id}>${this.deviceName(device)}</option>`)}
        </select>
        <span class="hint">${this.loading ? "Buscando vehículos…" : `${this.devices.length} vehículo(s) encontrado(s)`}</span>
      </label>
      <label>Nombre<input name="name" .value=${this.config.name ?? ""} @change=${this.updateField} /></label>
      <label>Color de fábrica
        <select name="color_preset" @change=${this.updateField}>
          ${Object.entries(PAINT_PRESETS).map(([key, preset]) => html`<option value=${key} ?selected=${this.config.color_preset === key}>${preset.label}</option>`)}
        </select>
      </label>
      ${this.config.color_preset === "custom" ? html`<label>Color personalizado<input name="vehicle_color" type="color" .value=${this.config.vehicle_color ?? DEFAULT_CONFIG.vehicle_color} @change=${this.updateField} /></label>` : nothing}
      <label>Diseño<select name="layout" @change=${this.updateField}><option value="full" ?selected=${this.config.layout === "full"}>Completo</option><option value="compact" ?selected=${this.config.layout === "compact"}>Compacto</option></select></label>
      <label>Imagen<select name="image_mode" @change=${this.updateField}><option value="rendered" ?selected=${this.config.image_mode === "rendered"}>Ilustración recoloreable</option><option value="custom" ?selected=${this.config.image_mode === "custom"}>Imagen personalizada</option></select></label>
      ${this.config.image_mode === "custom" ? html`<label>URL de imagen<input name="vehicle_image" .value=${this.config.vehicle_image ?? ""} placeholder="/local/coches/mi-civic.png" @change=${this.updateField} /></label>` : nothing}
      <label>Datos antiguos después de (segundos)<input name="stale_after" type="number" min="300" step="300" .value=${String(this.config.stale_after ?? DEFAULT_CONFIG.stale_after)} @change=${this.updateField} /></label>
      <label class="check"><input name="show_controls" type="checkbox" .checked=${this.config.show_controls !== false} @change=${this.updateField} /> Mostrar controles</label>
      <label class="check"><input name="confirm_unlock" type="checkbox" .checked=${this.config.confirm_unlock !== false} @change=${this.updateField} /> Confirmar antes de abrir</label>
    </div>`;
  }

  public static override styles = css`
    .grid{display:grid;gap:14px;padding:8px 0}label{display:grid;gap:5px;font-size:.9rem}input,select{box-sizing:border-box;width:100%;padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}.check{display:flex;align-items:center;gap:9px}.check input{width:auto}.hint{font-size:.8rem;color:var(--secondary-text-color)}
  `;
}
