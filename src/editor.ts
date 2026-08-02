import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DEFAULT_CONFIG, EDITOR_TAG, PAINT_PRESETS } from "./constants";
import type {
  DeviceRegistryEntry,
  EntityRegistryEntry,
  HomeAssistant,
  MyHondaPlusCardConfig,
} from "./types";

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

  private toggleListValue(event: Event, field: "controls" | "metrics"): void {
    const target = event.currentTarget as HTMLInputElement;
    const current = new Set((this.config[field] ?? DEFAULT_CONFIG[field]) as string[]);
    if (target.checked) current.add(target.value);
    else current.delete(target.value);
    const config = { ...this.config, [field]: [...current] } as MyHondaPlusCardConfig;
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private checklist(
    title: string,
    field: "controls" | "metrics",
    options: Array<[string, string]>,
  ): TemplateResult {
    const selected = new Set((this.config[field] ?? DEFAULT_CONFIG[field]) as string[]);
    return html`<fieldset>
      <legend>${title}</legend>
      <div class="checks">
        ${options.map(
          ([value, label]) =>
            html`<label class="check">
              <input
                type="checkbox"
                .value=${value}
                .checked=${selected.has(value)}
                @change=${(event: Event) => this.toggleListValue(event, field)}
              />
              ${label}
            </label>`,
        )}
      </div>
    </fieldset>`;
  }

  protected override render(): TemplateResult {
    return html`<div class="grid">
      <section>
        <h3>Vehículo</h3>
        <label
          >Vehículo conectado
          <select name="device" @change=${this.updateField}>
            <option value="">Selecciona un vehículo My Honda+</option>
            ${this.devices.map(
              (device) =>
                html`<option value=${device.id} ?selected=${this.config.device === device.id}>
                  ${this.deviceName(device)}
                </option>`,
            )}
          </select>
          <span class="hint"
            >${this.loading ? "Buscando vehículos…" : `${this.devices.length} vehículo(s) encontrado(s)`}</span
          >
        </label>
        <label
          >Nombre
          <input name="name" .value=${this.config.name ?? ""} @change=${this.updateField} />
        </label>
        <label
          >Modelo visual
          <select name="vehicle_model" @change=${this.updateField}>
            ${[
              ["auto", "Automático"],
              ["civic", "Honda Civic"],
              ["hrv", "Honda HR-V"],
              ["crv", "Honda CR-V"],
              ["zrv", "Honda ZR-V"],
              ["jazz", "Honda Jazz"],
              ["honda_e", "Honda e"],
              ["eny1", "Honda e:Ny1"],
              ["generic", "Honda genérico"],
            ].map(
              ([value, label]) =>
                html`<option value=${value} ?selected=${this.config.vehicle_model === value}>
                  ${label}
                </option>`,
            )}
          </select>
        </label>
      </section>

      <section>
        <h3>Apariencia</h3>
        <label
          >Color de fábrica
          <select name="color_preset" @change=${this.updateField}>
            ${Object.entries(PAINT_PRESETS).map(
              ([key, preset]) =>
                html`<option value=${key} ?selected=${this.config.color_preset === key}>
                  ${preset.label}
                </option>`,
            )}
          </select>
        </label>
        ${
          this.config.color_preset === "custom"
            ? html`<label
                >Color personalizado
                <input
                  name="vehicle_color"
                  type="color"
                  .value=${this.config.vehicle_color ?? DEFAULT_CONFIG.vehicle_color}
                  @change=${this.updateField}
                />
              </label>`
            : nothing
        }
        <label
          >Diseño
          <select name="layout" @change=${this.updateField}>
            <option value="full" ?selected=${this.config.layout === "full"}>Completo</option>
            <option value="compact" ?selected=${this.config.layout === "compact"}>Compacto</option>
          </select>
        </label>
        <label
          >Imagen
          <select name="image_mode" @change=${this.updateField}>
            <option value="rendered" ?selected=${this.config.image_mode === "rendered"}>
              Ilustración recoloreable
            </option>
            <option value="custom" ?selected=${this.config.image_mode === "custom"}>
              Imagen personalizada
            </option>
          </select>
        </label>
        ${
          this.config.image_mode === "custom"
            ? html`<label
                >URL de imagen
                <input
                  name="vehicle_image"
                  .value=${this.config.vehicle_image ?? ""}
                  placeholder="/local/coches/mi-civic.png"
                  @change=${this.updateField}
                />
              </label>`
            : nothing
        }
      </section>

      <section>
        <h3>Contenido</h3>
        ${this.checklist("Métricas", "metrics", [
          ["range", "Autonomía"],
          ["battery", "Batería"],
          ["odometer", "Kilometraje"],
        ])}
        ${this.checklist("Controles", "controls", [
          ["lock", "Cierre"],
          ["climate", "Climatización"],
          ["refresh", "Actualizar"],
          ["location", "Ubicación"],
        ])}
      </section>

      <section>
        <h3>Comportamiento</h3>
        <label
          >Idioma
          <select name="locale" @change=${this.updateField}>
            <option value="auto" ?selected=${this.config.locale === "auto"}>Automático</option>
            <option value="es" ?selected=${this.config.locale === "es"}>Español</option>
            <option value="en" ?selected=${this.config.locale === "en"}>English</option>
            <option value="gl" ?selected=${this.config.locale === "gl"}>Galego</option>
          </select>
        </label>
        <label
          >Datos antiguos después de (segundos)
          <input
            name="stale_after"
            type="number"
            min="300"
            step="300"
            .value=${String(this.config.stale_after ?? DEFAULT_CONFIG.stale_after)}
            @change=${this.updateField}
          />
        </label>
        <label class="check"
          ><input
            name="show_controls"
            type="checkbox"
            .checked=${this.config.show_controls !== false}
            @change=${this.updateField}
          />
          Mostrar controles</label
        >
        <label class="check"
          ><input
            name="show_model"
            type="checkbox"
            .checked=${this.config.show_model !== false}
            @change=${this.updateField}
          />
          Mostrar modelo</label
        >
        <label class="check"
          ><input
            name="animate"
            type="checkbox"
            .checked=${this.config.animate !== false}
            @change=${this.updateField}
          />
          Permitir animaciones</label
        >
        <label class="check"
          ><input
            name="confirm_unlock"
            type="checkbox"
            .checked=${this.config.confirm_unlock !== false}
            @change=${this.updateField}
          />
          Confirmar antes de abrir</label
        >
        <label class="check"
          ><input
            name="debug"
            type="checkbox"
            .checked=${this.config.debug === true}
            @change=${this.updateField}
          />
          Mostrar diagnóstico anonimizado</label
        >
      </section>
    </div>`;
  }

  public static override styles = css`
    .grid {
      display: grid;
      gap: 16px;
      padding: 8px 0;
    }
    section {
      display: grid;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }
    h3 {
      margin: 0;
      font-size: 1rem;
    }
    label {
      display: grid;
      gap: 5px;
      font-size: 0.9rem;
    }
    input,
    select {
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    input:focus-visible,
    select:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    fieldset {
      margin: 0;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    legend {
      padding: 0 5px;
      font-size: 0.85rem;
    }
    .checks {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .check {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .check input {
      width: auto;
    }
    .hint {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    @media (max-width: 520px) {
      .checks {
        grid-template-columns: 1fr;
      }
    }
  `;
}
