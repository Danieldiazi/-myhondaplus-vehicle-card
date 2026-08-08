# Configuration

[Español](CONFIGURATION.md) | **English**

## Data source

The card does not query Honda services directly. It uses the devices, entities and services created in Home Assistant by [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

Install and configure that integration before adding the card. The `device` value is the identifier of the device created by the integration in Home Assistant's device registry.

```text
My Honda+ for Home Assistant → device and entities → My Honda+ Vehicle Card
```

## Options

| Option | Type | Default | Description |
| --- | --- | ---: | --- |
| `device` | string | — | Device ID created by My Honda+ for Home Assistant. The editor selects it visually. |
| `name` | string | `My Honda+` | Displayed name. |
| `vehicle_model` | string | `auto` | Model used only to select the illustration. |
| `color_preset` | string | `rallye_red` | Preset color for the illustration shadow. |
| `vehicle_color` | string | `#a51d2d` | Hexadecimal shadow color when the preset is `custom`. |
| `image_mode` | `rendered` / `custom` | `rendered` | Included illustration or custom image. |
| `vehicle_image` | string | — | URL of the custom image. |
| `vehicle_scale` | number | `100` | Illustration scale from 70 to 140%. |
| `vehicle_alignment` | `left` / `center` / `right` | `center` | Horizontal illustration alignment. |
| `vehicle_shadow` | boolean | `true` | Enables the colored illustration shadow. |
| `shadow_intensity` | number | `60` | Shadow intensity from 0 to 100%. |
| `layout` | `full` / `compact` | `full` | Visual density. |
| `stale_after` | number | `21600` | Seconds before data is considered outdated. |
| `show_controls` | boolean | `true` | Shows action controls. |
| `show_model` | boolean | `true` | Shows the visual model below the name. |
| `animate` | boolean | `true` | Allows animation while respecting reduced-motion preferences. |
| `confirm_unlock` | boolean | `true` | Requests confirmation before unlocking. |
| `confirm_climate` | boolean | `false` | Requests confirmation before climate actions. |
| `confirm_horn_lights` | boolean | `false` | Requests confirmation before horn and lights. |
| `confirm_refresh` | boolean | `false` | Requests confirmation before either data refresh action. |
| `warn_stale_actions` | boolean | `true` | Warns before a remote action when displayed data is outdated. |
| `locale` | `auto` / `es` / `en` / `gl` | `auto` | Card language. `auto` uses the Home Assistant language. |
| `debug` | boolean | `false` | Shows anonymized diagnostics. |
| `controls` | array | defaults | Visible controls; controls without an entity are hidden. |
| `metrics` | array | defaults | Visible metrics; metrics without an entity are hidden. |
| `statuses` | array | defaults | Visible statuses and their order; statuses without an entity are hidden. |
| `entities` | object | automatic | Advanced override for detected entities. |

### Metric, status and control keys

- `metrics`: `range`, `battery`, `odometer`, `trip_distance`, `trip_consumption` and `trip_duration`.
- `statuses`: `doors`, `windows`, `trunk`, `hood`, `lights`, `charging`, `climate` and `location`.
- `controls`: `lock`, `climate`, `horn_lights`, `refresh_cached` and `refresh`.

`refresh_cached` queries the vehicle data stored in Honda's cloud again. `refresh` requests new data directly from the vehicle. A control is shown only when the integration publishes its entity; not every vehicle offers both refresh actions. Location is an informational status that opens Home Assistant's native details dialog, not a remote action.

`vehicle_model: auto` selects an illustration from the device information. Manual values are `civic`, `hrv`, `crv`, `zrv`, `jazz`, `honda_e`, `eny1` and `generic`. Changing this setting affects only artwork and never enables capabilities.

Available shadow presets are `rallye_red`, `platinum_white`, `crystal_black`, `sonic_grey`, `urban_grey`, `premium_blue`, `canyon_river_blue`, `silver` and `custom`.

If a custom `vehicle_image` cannot load, the card keeps its URL in the configuration and displays the Honda fallback with a localized warning.

## Minimal configuration

```yaml
type: custom:myhondaplus-vehicle-card
device: DEVICE_ID_CREATED_BY_THE_INTEGRATION
```

The visual editor reads the Home Assistant device registry, so manually copying the identifier is normally unnecessary. It also reports integration detection, vehicles and compatible capabilities. **Detect integration and entities again** refreshes that information.

## Manual entity overrides

```yaml
entities:
  range: sensor.civic_total_range
  lock: lock.civic_doors
  location: device_tracker.civic_location
```

Automatic discovery uses the device, Home Assistant domain and stable keys exposed by the integration. Manual overrides always take priority.

## Capability discovery

The card never assigns capabilities by model. The model selects artwork only; available functionality comes from active `myhondaplus` entities associated with the device.

- A missing entity hides its metric, status or control.
- An existing `unknown` or `unavailable` entity is shown as **No data**, and unavailable controls are disabled.
- A valid entity is displayed and can be used.
- Traction battery data is recognized only through specific stable battery keys.

## Confirmations and outdated data

`confirm_unlock` is enabled by default. `confirm_climate`, `confirm_horn_lights` and `confirm_refresh` enable confirmation for additional actions. `confirm_refresh` protects both cached-data refresh and direct-from-vehicle refresh.

When `warn_stale_actions` is enabled and data exceeds `stale_after`, the card warns before locking, climate, horn and lights, or direct vehicle refresh. If an action also has its own confirmation, both messages appear in one dialog.

## Responsibility boundaries

The card can display only the entities and services published by the integration.

- If the vehicle or its entities are missing from Home Assistant, troubleshoot the My Honda+ integration.
- If entities exist but the card does not recognize them, copy anonymized diagnostics and open an issue here.
- Never publish VINs, credentials, tokens or coordinates.
