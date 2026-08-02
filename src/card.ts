import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CARD_TAG, DEFAULT_CONFIG, PAINT_PRESETS } from "./constants";
import { createDiagnostics, diagnosticsText } from "./diagnostics";
import { resolveEntities } from "./entity-resolver";
import { localize, normalizeLocale, type TranslationKey } from "./localize";
import { resolveVehicleModel, vehicleModelLabel } from "./model-resolver";
import type {
  DeviceRegistryEntry,
  EntityMap,
  EntityRegistryEntry,
  HassEntity,
  HomeAssistant,
  MyHondaPlusCardConfig,
  VehicleModelKey,
  VehicleState,
} from "./types";
import { renderVehicleArt } from "./vehicle-art";
import { buildVehicleState } from "./vehicle-state";

const DEFAULT_CONTROLS = ["lock", "climate", "refresh", "location"] as const;
const DEFAULT_METRICS = ["range", "battery", "odometer"] as const;

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

  private metric(key: "range" | "battery" | "odometer", state: VehicleState): TemplateResult {
    const metadata = {
      range: { icon: "🛣️", label: this.t("range"), value: state.range },
      battery: { icon: "🔋", label: this.t("battery"), value: state.battery },
      odometer: { icon: "◉", label: this.t("odometer"), value: state.odometer },
    }[key];

    return html`<div class="metric">
      <span aria-hidden="true">${metadata.icon}</span>
      <div><small>${metadata.label}</small><strong>${metadata.value}</strong></div>
    </div>`;
  }

  private status(
    icon: string,
    label: string,
    active: boolean,
    activeText: string,
    inactiveText: string,
  ): TemplateResult {
    return html`<div
      class="status ${active ? "warning" : ""}"
      aria-label=${`${label}: ${active ? activeText : inactiveText}`}
    >
      <span class="status-icon" aria-hidden="true">${icon}</span>
      <div><b>${label}</b><small>${active ? activeText : inactiveText}</small></div>
      <i aria-hidden="true"></i>
    </div>`;
  }

  private control(
    icon: string,
    label: string,
    key: "lock" | "climate" | "refresh" | "location",
  ): TemplateResult | typeof nothing {
    if (!this.entities[key]) return nothing;
    const loading = this.busy === key;
    return html`<button
      type="button"
      aria-label=${label}
      aria-busy=${loading ? "true" : "false"}
      ?disabled=${Boolean(this.busy)}
      @click=${() => void this.execute(key)}
    >
      <span aria-hidden="true">${loading ? "…" : icon}</span><small>${label}</small>
    </button>`;
  }

  private vehicleVisual(state: VehicleState): TemplateResult {
    if (this.config.image_mode === "custom" && this.config.vehicle_image) {
      return html`<img src=${this.config.vehicle_image} alt=${this.t("vehicle")} loading="lazy" />`;
    }
    return renderVehicleArt(this.model(), this.paintColor(), {
      charging: state.charging,
      climate: state.climateActive,
      lights: state.lightsOn,
    });
  }

  protected override render(): TemplateResult {
    const state = this.vehicleState();
    const lockedText =
      state.locked === true
        ? this.t("locked")
        : state.locked === false
          ? this.t("unlocked")
          : this.t("unknown_state");
    const controls = this.config.controls ?? [...DEFAULT_CONTROLS];
    const metrics = this.config.metrics ?? [...DEFAULT_METRICS];

    return html`<ha-card class=${this.config.animate === false ? "reduce-motion" : ""}>
      <header>
        <div>
          <h2>${this.config.name}</h2>
          ${this.config.show_model !== false ? html`<p>${vehicleModelLabel(this.model())}</p>` : nothing}
        </div>
        <span class="badge ${state.locked === false ? "alert" : ""}">
          ${state.locked ? "🔒" : "🔓"} ${lockedText}
        </span>
      </header>

      <div class="announcer" aria-live="polite">
        ${this.busy ? this.t("action_in_progress") : (this.message?.text ?? "")}
      </div>
      ${this.message ? html`<div class="message ${this.message.kind}">${this.message.text}</div>` : nothing}

      <section class="vehicle ${state.charging ? "is-charging" : ""}">
        ${this.vehicleVisual(state)}
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
              ${this.status("🚪", this.t("doors"), state.doorsOpen, this.t("open"), this.t("closed"))}
              ${this.status("▤", this.t("windows"), state.windowsOpen, this.t("open"), this.t("closed"))}
              ${this.status("▰", this.t("trunk"), state.trunkOpen, this.t("open"), this.t("closed"))}
              ${this.status("▱", this.t("hood"), state.hoodOpen, this.t("open"), this.t("closed"))}
              ${this.status("💡", this.t("lights"), state.lightsOn, this.t("on"), this.t("off"))}
              ${this.status("⚡", this.t("charging"), state.charging, this.t("active"), this.t("inactive"))}
            </section>`
          : nothing
      }
      ${
        this.config.show_controls !== false
          ? html`<nav class="controls" aria-label="Vehicle controls">
              ${controls.map((key) => {
              const metadata = {
                lock: {
                  icon: state.locked ? "🔓" : "🔒",
                  label: state.locked ? this.t("unlock") : this.t("lock"),
                },
                climate: { icon: "❄️", label: this.t("climate") },
                refresh: { icon: "↻", label: this.t("refresh") },
                location: { icon: "⌖", label: this.t("location") },
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
      background: linear-gradient(
        145deg,
        var(--ha-card-background, var(--card-background-color)),
        color-mix(
          in srgb,
          var(--ha-card-background, var(--card-background-color)) 90%,
          var(--primary-color) 10%
        )
      );
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
      padding: 7px 11px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      font-size: 0.76rem;
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
      filter: drop-shadow(0 16px 18px rgba(0, 0, 0, 0.12));
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
