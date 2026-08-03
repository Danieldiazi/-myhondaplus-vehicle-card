import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_TAG, DEFAULT_CONFIG, PAINT_PRESETS } from "./constants";
import { createDiagnostics, diagnosticsText } from "./diagnostics";
import { resolveEntities } from "./entity-resolver";
import { localize, normalizeLocale, type TranslationKey } from "./localize";
import { resolveVehicleModel, vehicleModelLabel } from "./model-resolver";
import type {
  DeviceRegistryEntry,
  ControlKey,
  EntityMap,
  EntityRegistryEntry,
  HassEntity,
  HomeAssistant,
  MetricKey,
  MyHondaPlusCardConfig,
  VehicleModelKey,
  VehicleState,
} from "./types";
import { renderVehicleArt } from "./vehicle-art";
import { buildVehicleState } from "./vehicle-state";

@customElement(CARD_TAG)
export class MyHondaPlusVehicleCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: MyHondaPlusCardConfig = { ...DEFAULT_CONFIG };
  @state() private entities: Partial<EntityMap> = {};
  @state() private device?: DeviceRegistryEntry;
  @state() private busy?: keyof EntityMap;
  @state() private message?: { kind: "error" | "success"; text: string };
  private loadedDevice?: string;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./editor");
    return document.createElement("myhondaplus-vehicle-card-editor");
  }

  public static getStubConfig(): MyHondaPlusCardConfig {
    return { ...DEFAULT_CONFIG };
  }

  public setConfig(config: MyHondaPlusCardConfig): void {
    if (!config) throw new Error(localize("required_config", "es"));
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

  private locale(): string {
    return this.config.locale && this.config.locale !== "auto"
      ? this.config.locale
      : normalizeLocale(this.hass?.language);
  }

  private t(key: TranslationKey, replacements: Record<string, string | number> = {}): string {
    return localize(key, this.locale(), replacements);
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
      this.message = undefined;
    } catch (error) {
      this.loadedDevice = undefined;
      this.message = { kind: "error", text: this.t("discovery_failed") };
      console.warn("My Honda+ Vehicle Card: discovery failed", error);
    }
  }

  private entity(key: keyof EntityMap): HassEntity | undefined {
    const entityId = this.entities[key];
    return entityId ? this.hass?.states[entityId] : undefined;
  }

  private entityRecord(): Partial<Record<keyof EntityMap, HassEntity | undefined>> {
    return Object.fromEntries(
      (Object.keys(this.entities) as (keyof EntityMap)[]).map((key) => [key, this.entity(key)]),
    ) as Partial<Record<keyof EntityMap, HassEntity | undefined>>;
  }

  private vehicleState(): VehicleState {
    return buildVehicleState(
      this.entityRecord(),
      this.config.stale_after ?? DEFAULT_CONFIG.stale_after,
    );
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

  private ageText(state: VehicleState): string {
    if (state.ageSeconds === undefined) return this.t("no_update_date");
    if (state.ageSeconds < 60) return this.t("updated_now");
    if (state.ageSeconds < 3600)
      return this.t("updated_minutes", { count: Math.floor(state.ageSeconds / 60) });
    return this.t("updated_hours", { count: Math.floor(state.ageSeconds / 3600) });
  }

  private async execute(key: keyof EntityMap): Promise<void> {
    const entityId = this.entities[key];
    if (!entityId || !this.hass || this.busy) return;

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

    const state = this.vehicleState();
    const domain = entityId.split(".")[0] ?? "";
    let service =
      domain === "button" ? "press" : this.entity(key)?.state === "on" ? "turn_off" : "turn_on";
    if (domain === "lock") service = state.locked ? "unlock" : "lock";

    if (
      domain === "lock" &&
      service === "unlock" &&
      this.config.confirm_unlock !== false &&
      !window.confirm(this.t("confirm_unlock"))
    )
      return;

    this.busy = key;
    this.message = undefined;
    try {
      await this.hass.callService(domain, service, { entity_id: entityId });
    } catch (error) {
      this.message = { kind: "error", text: this.t("action_failed") };
      console.warn("My Honda+ Vehicle Card: service call failed", { domain, service, error });
    } finally {
      this.busy = undefined;
    }
  }

  private async copyDiagnostics(): Promise<void> {
    const text = diagnosticsText(
      createDiagnostics(this.hass, this.entities, this.model(), this.locale()),
    );
    try {
      await navigator.clipboard.writeText(text);
      this.message = { kind: "success", text: "Diagnostics copied" };
    } catch {
      this.message = { kind: "error", text };
    }
  }

  private metric(key: MetricKey, state: VehicleState): TemplateResult | typeof nothing {
    if (!this.entities[key]) return nothing;
    const metadata = {
      range: { icon: "mdi:map-marker-distance", label: this.t("range"), value: state.range },
      battery: { icon: "mdi:battery", label: this.t("battery"), value: state.battery },
      odometer: { icon: "mdi:counter", label: this.t("odometer"), value: state.odometer },
      trip_distance: {
        icon: "mdi:map-marker-path",
        label: this.t("trip_distance"),
        value: state.tripDistance,
      },
      trip_consumption: {
        icon: "mdi:gas-station",
        label: this.t("trip_consumption"),
        value: state.tripConsumption,
      },
      trip_duration: {
        icon: "mdi:timer-outline",
        label: this.t("trip_duration"),
        value: state.tripDuration,
      },
    }[key];

    return html`<div class="metric">
      <ha-icon icon=${metadata.icon} aria-hidden="true"></ha-icon>
      <div><small>${metadata.label}</small><strong>${metadata.value}</strong></div>
    </div>`;
  }

  private status(
    icon: string,
    label: string,
    active: boolean | undefined,
    activeText: string,
    inactiveText: string,
  ): TemplateResult {
    const text = active === undefined ? this.t("unavailable") : active ? activeText : inactiveText;
    return html`<div
      class="status ${active === true ? "warning" : ""} ${active === undefined ? "unavailable" : ""}"
      aria-label=${`${label}: ${text}`}
    >
      <ha-icon class="status-icon" icon=${icon} aria-hidden="true"></ha-icon>
      <div><b>${label}</b><small>${text}</small></div>
      <i aria-hidden="true"></i>
    </div>`;
  }

  private control(icon: string, label: string, key: ControlKey): TemplateResult | typeof nothing {
    if (!this.entities[key]) return nothing;
    const loading = this.busy === key;
    const entity = this.entity(key);
    const domain = this.entities[key]?.split(".")[0];
    const state = entity?.state.toLowerCase();
    const unavailable =
      !entity ||
      state === "unavailable" ||
      (state === "unknown" && domain !== "button" && key !== "location");
    return html`<button
      type="button"
      aria-label=${label}
      aria-busy=${loading ? "true" : "false"}
      ?disabled=${Boolean(this.busy) || unavailable}
      @click=${() => void this.execute(key)}
    >
      <span aria-hidden="true"> ${loading ? "…" : html`<ha-icon icon=${icon}></ha-icon>`} </span>
      <small>${label}</small>
    </button>`;
  }

  private vehicleVisual(): TemplateResult {
    if (this.config.image_mode === "custom" && this.config.vehicle_image) {
      return html`<img src=${this.config.vehicle_image} alt=${this.t("vehicle")} loading="lazy" />`;
    }
    return renderVehicleArt(this.model());
  }

  private visualStyle(): string {
    const scale = Math.min(140, Math.max(70, this.config.vehicle_scale ?? 100));
    const intensity =
      this.config.vehicle_shadow === false
        ? 0
        : Math.min(100, Math.max(0, this.config.shadow_intensity ?? 60));
    const alpha = Math.round((intensity / 100) * 255)
      .toString(16)
      .padStart(2, "0");
    return `--vehicle-scale:${scale / 100};--vehicle-shadow-opacity:${intensity / 100};--vehicle-shadow-color:${this.paintColor()}${alpha}`;
  }

  protected override render(): TemplateResult {
    const state = this.vehicleState();
    const lockedText =
      state.locked === true
        ? this.t("locked")
        : state.locked === false
          ? this.t("unlocked")
          : this.t("unknown_state");
    const controls = this.config.controls ?? [...DEFAULT_CONFIG.controls];
    const metrics = this.config.metrics ?? [...DEFAULT_CONFIG.metrics];
    const alignment = this.config.vehicle_alignment ?? DEFAULT_CONFIG.vehicle_alignment;

    return html`<ha-card class=${this.config.animate === false ? "reduce-motion" : ""}>
      <header>
        <div>
          <h2>${this.config.name}</h2>
          ${this.config.show_model !== false ? html`<p>${vehicleModelLabel(this.model())}</p>` : nothing}
        </div>
        ${
          this.entities.lock
            ? html`<span class="badge ${state.locked === false ? "alert" : ""}">
                <ha-icon
                  icon=${
                    state.locked === true
                      ? "mdi:lock"
                      : state.locked === false
                        ? "mdi:lock-open-variant"
                        : "mdi:lock-question"
                  }
                  aria-hidden="true"
                ></ha-icon>
                ${lockedText}
              </span>`
            : nothing
        }
      </header>

      <div class="announcer" aria-live="polite">
        ${this.busy ? this.t("action_in_progress") : (this.message?.text ?? "")}
      </div>
      ${this.message ? html`<div class="message ${this.message.kind}">${this.message.text}</div>` : nothing}

      <section
        class="vehicle align-${alignment} ${state.charging === true ? "is-charging" : ""}"
        style=${this.visualStyle()}
      >
        ${this.vehicleVisual()}
        <div
          class="freshness ${state.stale ? "stale" : ""}"
          title=${state.stale ? this.t("stale_data") : ""}
        >
          ${this.ageText(state)}
        </div>
      </section>

      ${
        this.config.device
          ? html`<section class="metrics">
              ${metrics.map((key) => this.metric(key, state))}
            </section>`
          : html`<div class="setup">${this.t("select_vehicle")}</div>`
      }
      ${
        this.config.layout !== "compact"
          ? html`<section class="statuses">
              ${this.entities.doors ? this.status("mdi:car-door", this.t("doors"), state.doorsOpen, this.t("open"), this.t("closed")) : nothing}
              ${this.entities.windows ? this.status("mdi:window-closed-variant", this.t("windows"), state.windowsOpen, this.t("open"), this.t("closed")) : nothing}
              ${this.entities.trunk ? this.status("mdi:car-back", this.t("trunk"), state.trunkOpen, this.t("open"), this.t("closed")) : nothing}
              ${this.entities.hood ? this.status("mdi:car", this.t("hood"), state.hoodOpen, this.t("open"), this.t("closed")) : nothing}
              ${this.entities.lights ? this.status("mdi:car-light-high", this.t("lights"), state.lightsOn, this.t("on"), this.t("off")) : nothing}
              ${this.entities.charging ? this.status("mdi:battery-charging", this.t("charging"), state.charging, this.t("active"), this.t("inactive")) : nothing}
              ${this.entities.climate ? this.status("mdi:snowflake", this.t("climate"), state.climateActive, this.t("active"), this.t("inactive")) : nothing}
            </section>`
          : nothing
      }
      ${
        this.config.show_controls !== false
          ? html`<nav class="controls" aria-label="Vehicle controls">
              ${controls.map((key) => {
                const metadata = {
                  lock: {
                    icon:
                      state.locked === true
                        ? "mdi:lock-open-variant"
                        : state.locked === false
                          ? "mdi:lock"
                          : "mdi:lock-question",
                    label: state.locked ? this.t("unlock") : this.t("lock"),
                  },
                  climate: { icon: "mdi:snowflake", label: this.t("climate") },
                  horn_lights: { icon: "mdi:bullhorn", label: this.t("horn_lights") },
                  refresh_cached: {
                    icon: "mdi:database-refresh",
                    label: this.t("refresh_cached"),
                  },
                  refresh: { icon: "mdi:car-connected", label: this.t("refresh_from_car") },
                  location: { icon: "mdi:map-marker", label: this.t("location") },
                }[key];
                return this.control(metadata.icon, metadata.label, key);
              })}
            </nav>`
          : nothing
      }
      ${
        this.config.debug
          ? html`<details class="diagnostics">
              <summary>Diagnostics</summary>
              <button type="button" @click=${() => void this.copyDiagnostics()}>
                Copy anonymized diagnostics
              </button>
              <pre>
${diagnosticsText(createDiagnostics(this.hass, this.entities, this.model(), this.locale()))}</pre>
            </details>`
          : nothing
      }
    </ha-card>`;
  }

  public static override styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 20px;
      overflow: hidden;
      color: var(--primary-text-color);
      background: var(--ha-card-background, var(--card-background-color));
    }
    header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    p {
      margin: 4px 0 0;
      color: var(--secondary-text-color);
      font-size: 0.83rem;
    }
    .badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 7px 11px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      font-size: 0.76rem;
    }
    .badge ha-icon,
    .status-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .alert,
    .message.error {
      color: var(--error-color);
    }
    .announcer {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    .message {
      margin-top: 10px;
      padding: 9px 11px;
      border-radius: 10px;
      background: var(--secondary-background-color);
      font-size: 0.8rem;
    }
    .vehicle {
      position: relative;
      min-height: 235px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vehicle svg,
    .vehicle img {
      width: 100%;
      max-height: 250px;
      object-fit: contain;
      transform: scale(var(--vehicle-scale, 1));
      filter: drop-shadow(0 16px 18px rgb(0 0 0 / calc(var(--vehicle-shadow-opacity, 0.6) * 0.2)));
      transform-origin: center;
    }
    .vehicle.align-left {
      justify-content: flex-start;
    }
    .vehicle.align-left svg,
    .vehicle.align-left img {
      transform-origin: left center;
    }
    .vehicle.align-right {
      justify-content: flex-end;
    }
    .vehicle.align-right svg,
    .vehicle.align-right img {
      transform-origin: right center;
    }
    .vehicle img.civic-lateral-art {
      filter: drop-shadow(0 8px 6px var(--vehicle-shadow-color));
    }
    .vehicle img.honda-logo-art {
      width: clamp(120px, 34%, 150px);
      max-height: 150px;
      margin-bottom: 28px;
      filter: drop-shadow(0 10px 12px var(--vehicle-shadow-color))
        drop-shadow(0 0 14px var(--vehicle-shadow-color));
    }
    .freshness {
      position: absolute;
      bottom: 7px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.72rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .freshness.stale {
      color: var(--warning-color, #f9a825);
      font-weight: 600;
    }
    .metrics,
    .controls {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 9px;
    }
    .metric {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 11px;
      border-radius: 14px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
    }
    .metric ha-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .metric small,
    .metric strong,
    .status small,
    .status b {
      display: block;
    }
    .metric small,
    .status small {
      color: var(--secondary-text-color);
    }
    .statuses {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin-top: 13px;
    }
    .status {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 9px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      font-size: 0.78rem;
    }
    .status i {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--success-color, #43a047);
    }
    .status.warning i {
      background: var(--error-color);
    }
    .status.unavailable i {
      background: var(--disabled-text-color, var(--secondary-text-color));
    }
    .controls {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-top: 15px;
    }
    button {
      display: grid;
      place-items: center;
      gap: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      padding: 10px 5px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      transition: transform 0.18s ease;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    button:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: progress;
      opacity: 0.65;
    }
    button ha-icon {
      color: var(--primary-text-color);
      --mdc-icon-size: 21px;
    }
    .setup {
      padding: 18px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .diagnostics {
      margin-top: 14px;
      font-size: 0.8rem;
    }
    .diagnostics pre {
      overflow: auto;
      max-height: 260px;
      padding: 10px;
      background: var(--secondary-background-color);
      border-radius: 10px;
      white-space: pre-wrap;
    }
    .reduce-motion *,
    .reduce-motion *::before,
    .reduce-motion *::after {
      animation: none !important;
      transition: none !important;
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    @media (max-width: 520px) {
      ha-card {
        padding: 16px;
      }
      .vehicle {
        min-height: 190px;
      }
      .metrics,
      .statuses {
        grid-template-columns: 1fr;
      }
      .controls {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;
}
