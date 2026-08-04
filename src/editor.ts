import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DEFAULT_CONFIG, EDITOR_TAG, PAINT_PRESETS } from "./constants";
import { resolveEntities } from "./entity-resolver";
import { localize, normalizeLocale, type TranslationKey } from "./localize";
import type {
  DeviceRegistryEntry,
  EntityMap,
  EntityRegistryEntry,
  HomeAssistant,
  MyHondaPlusCardConfig,
} from "./types";

@customElement(EDITOR_TAG)
export class MyHondaPlusVehicleCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: MyHondaPlusCardConfig = { ...DEFAULT_CONFIG };
  @state() private devices: DeviceRegistryEntry[] = [];
  @state() private registryEntries: EntityRegistryEntry[] = [];
  @state() private loading = false;

  public setConfig(config: MyHondaPlusCardConfig): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private locale(): string {
    return this.config.locale && this.config.locale !== "auto"
      ? this.config.locale
      : normalizeLocale(this.hass?.language);
  }

  private t(key: TranslationKey, replacements: Record<string, string | number> = {}): string {
    return localize(key, this.locale(), replacements);
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
      this.registryEntries = entities;
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
    if (["stale_after", "vehicle_scale", "shadow_intensity"].includes(target.name))
      value = Number(target.value);

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
    const detected = this.detectedEntities();
    return html`<fieldset>
      <legend>${title}</legend>
      <div class="checks">
        ${options.map(([value, label]) => {
          const available = !this.config.device || Boolean(detected[value as keyof EntityMap]);
          return html`<label class="check">
            <input
              type="checkbox"
              .value=${value}
              .checked=${selected.has(value)}
              ?disabled=${!available && !selected.has(value)}
              @change=${(event: Event) => this.toggleListValue(event, field)}
            />
            ${label}${available ? "" : ` — ${this.t("editor_not_available")}`}
          </label>`;
        })}
      </div>
    </fieldset>`;
  }

  private detectedEntities(): Partial<EntityMap> {
    if (!this.config.device) return {};
    return resolveEntities(
      this.registryEntries.filter((entry) => entry.device_id === this.config.device),
      this.config.entities,
    );
  }

  protected override render(): TemplateResult {
    return html`<div class="grid">
      <section>
        <h3>${this.t("editor_vehicle")}</h3>
        <label
          >${this.t("connected_vehicle")}
          <select name="device" @change=${this.updateField}>
            <option value="">${this.t("editor_select_vehicle")}</option>
            ${this.devices.map(
              (device) =>
                html`<option value=${device.id} ?selected=${this.config.device === device.id}>
                  ${this.deviceName(device)}
                </option>`,
            )}
          </select>
          <span class="hint"
            >${
              this.loading
                ? this.t("editor_searching_vehicles")
                : this.t("editor_vehicles_found", { count: this.devices.length })
            }</span
          >
        </label>
        <label
          >${this.t("editor_name")}
          <input name="name" .value=${this.config.name ?? ""} @change=${this.updateField} />
        </label>
        <label
          >${this.t("editor_visual_model")}
          <select name="vehicle_model" @change=${this.updateField}>
            ${[
              ["auto", this.t("editor_automatic")],
              ["civic", "Honda Civic"],
              ["hrv", "Honda HR-V"],
              ["crv", "Honda CR-V"],
              ["zrv", "Honda ZR-V"],
              ["jazz", "Honda Jazz"],
              ["honda_e", "Honda e"],
              ["eny1", "Honda e:Ny1"],
              ["generic", this.t("editor_generic_honda")],
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
        <h3>${this.t("editor_appearance")}</h3>
        <label
          >${this.t("editor_layout")}
          <select name="layout" @change=${this.updateField}>
            <option value="full" ?selected=${this.config.layout === "full"}>
              ${this.t("editor_full")}
            </option>
            <option value="compact" ?selected=${this.config.layout === "compact"}>
              ${this.t("editor_compact")}
            </option>
          </select>
        </label>
        <label
          >${this.t("editor_vehicle_scale")}
          <input
            name="vehicle_scale"
            type="number"
            min="70"
            max="140"
            step="5"
            .value=${String(this.config.vehicle_scale ?? DEFAULT_CONFIG.vehicle_scale)}
            @change=${this.updateField}
          />
        </label>
        <label
          >${this.t("editor_alignment")}
          <select name="vehicle_alignment" @change=${this.updateField}>
            <option value="left" ?selected=${this.config.vehicle_alignment === "left"}>
              ${this.t("editor_left")}
            </option>
            <option value="center" ?selected=${this.config.vehicle_alignment === "center"}>
              ${this.t("editor_center")}
            </option>
            <option value="right" ?selected=${this.config.vehicle_alignment === "right"}>
              ${this.t("editor_right")}
            </option>
          </select>
        </label>
        <label class="check"
          ><input
            name="vehicle_shadow"
            type="checkbox"
            .checked=${this.config.vehicle_shadow !== false}
            @change=${this.updateField}
          />
          ${this.t("editor_show_shadow")}</label
        >
        ${
          this.config.vehicle_shadow !== false
            ? html`
                <label
                  >${this.t("editor_shadow_color")}
                  <select name="color_preset" @change=${this.updateField}>
                    ${Object.entries(PAINT_PRESETS).map(
                      ([key, preset]) =>
                        html`<option value=${key} ?selected=${this.config.color_preset === key}>
                          ${key === "custom" ? this.t("editor_custom") : preset.label}
                        </option>`,
                    )}
                  </select>
                </label>
                ${
                  this.config.color_preset === "custom"
                    ? html`<label
                        >${this.t("editor_custom_shadow_color")}
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
                  >${this.t("editor_shadow_intensity")}
                  <input
                    name="shadow_intensity"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    .value=${String(this.config.shadow_intensity ?? DEFAULT_CONFIG.shadow_intensity)}
                    @change=${this.updateField}
                  />
                </label>
              `
            : nothing
        }
        <label
          >${this.t("editor_image")}
          <select name="image_mode" @change=${this.updateField}>
            <option value="rendered" ?selected=${this.config.image_mode === "rendered"}>
              ${this.t("editor_included_art")}
            </option>
            <option value="custom" ?selected=${this.config.image_mode === "custom"}>
              ${this.t("editor_custom_image")}
            </option>
          </select>
        </label>
        ${
          this.config.image_mode === "custom"
            ? html`<label
                >${this.t("editor_image_url")}
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
        <h3>${this.t("editor_content")}</h3>
        ${this.checklist(this.t("editor_metrics"), "metrics", [
          ["range", this.t("range")],
          ["battery", this.t("battery")],
          ["odometer", this.t("odometer")],
          ["trip_distance", this.t("trip_distance")],
          ["trip_consumption", this.t("trip_consumption")],
          ["trip_duration", this.t("trip_duration")],
        ])}
        ${this.checklist(this.t("editor_controls"), "controls", [
          ["lock", this.t("editor_locking")],
          ["climate", this.t("climate")],
          ["horn_lights", this.t("horn_lights")],
          ["refresh_cached", this.t("refresh_cached")],
          ["refresh", this.t("refresh_from_car")],
          ["location", this.t("location")],
        ])}
      </section>

      <section>
        <h3>${this.t("editor_behavior")}</h3>
        <label
          >${this.t("editor_language")}
          <select name="locale" @change=${this.updateField}>
            <option value="auto" ?selected=${this.config.locale === "auto"}>
              ${this.t("editor_automatic")}
            </option>
            <option value="es" ?selected=${this.config.locale === "es"}>Español</option>
            <option value="en" ?selected=${this.config.locale === "en"}>English</option>
            <option value="gl" ?selected=${this.config.locale === "gl"}>Galego</option>
          </select>
        </label>
        <label
          >${this.t("editor_stale_after")}
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
          ${this.t("editor_show_controls")}</label
        >
        <label class="check"
          ><input
            name="show_model"
            type="checkbox"
            .checked=${this.config.show_model !== false}
            @change=${this.updateField}
          />
          ${this.t("editor_show_model")}</label
        >
        <label class="check"
          ><input
            name="animate"
            type="checkbox"
            .checked=${this.config.animate !== false}
            @change=${this.updateField}
          />
          ${this.t("editor_allow_animations")}</label
        >
        <label class="check"
          ><input
            name="confirm_unlock"
            type="checkbox"
            .checked=${this.config.confirm_unlock !== false}
            @change=${this.updateField}
          />
          ${this.t("editor_confirm_unlock")}</label
        >
        <label class="check"
          ><input
            name="debug"
            type="checkbox"
            .checked=${this.config.debug === true}
            @change=${this.updateField}
          />
          ${this.t("editor_show_diagnostics")}</label
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
