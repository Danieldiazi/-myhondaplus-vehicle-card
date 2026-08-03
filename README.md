# My Honda+ Vehicle Card

**English** | [Español](README.es.md)

Unofficial Lovelace card for displaying and controlling connected vehicles through the community [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant) integration.

> This repository contains only the dashboard card. **It does not connect directly to Honda services.** To obtain vehicle data, you must first install and configure the My Honda+ integration linked above.
>
> Community project, not affiliated with Honda Motor Co., Ltd. or with the author of the Home Assistant integration.

## Requirements

Before installing the card, you need:

1. Home Assistant with a Lovelace dashboard.
2. The [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant) integration installed and working.
3. At least one vehicle and its entities available in Home Assistant.
4. HACS, recommended for installing and updating this card.

The integration retrieves and publishes the data as Home Assistant devices and entities. This card only discovers, displays and controls those entities.

## Highlights

- Visual configuration with automatic vehicle discovery.
- A dedicated Civic illustration and a generic Honda logo for all other models.
- Content automatically adapted to the entities each vehicle publishes in Home Assistant.
- Configurable metrics and controls.
- Spanish, English and Galician, selected automatically from the active language.
- Anonymized diagnostics for requesting support without sharing the VIN, coordinates or complete identifiers.
- Door, window, trunk, hood, light, charging and climate status.
- Responsive design, dark mode, keyboard focus and automatic reduced-motion support.
- Confirmation before unlocking and prevention of duplicate actions.

## Visual and functional compatibility

| Model                                   | Illustration             | Information and controls                    |
| --------------------------------------- | ------------------------ | ------------------------------------------- |
| Honda Civic                             | Dedicated side-view SVG  | Discovered from its My Honda+ entities      |
| HR-V, CR-V, ZR-V, Jazz, Honda e and e:Ny1 | Honda logo             | Discovered from their My Honda+ entities    |
| Other compatible Honda vehicles         | Honda logo               | Discovered from their My Honda+ entities    |

The model determines only the illustration. Battery, charging, climate, locking and other sections are displayed only when the integration creates the corresponding entity for the device. A temporarily unavailable entity is shown as **No data**; an unsupported capability is hidden.

The Honda logo is used only as a visual identifier for models without a dedicated illustration. Honda is a registered trademark, and this community project is not affiliated with Honda Motor Co., Ltd.

## Quick installation

### 1. Install the data integration

Install and configure [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant). Check under **Settings → Devices & services** that Home Assistant displays the vehicle and its entities.

### 2. Add the repository to HACS

1. Open **HACS** and go to **Frontend**.
2. Open the three-dot menu in the upper-right corner.
3. Select **Custom repositories**.
4. Paste the following URL into **Repository**:

   ```text
   https://github.com/Danieldiazi/myhondaplus-vehicle-card
   ```

5. Under **Type**, select **Dashboard**. The label may vary slightly depending on your HACS version or translation.
6. Select **Add**.

Adding the custom repository only makes it available to HACS. **The card is not installed yet.**

### 3. Download and install the card from HACS

1. Return to **HACS → Frontend**.
2. Search for **My Honda+ Vehicle Card** or open the repository you just added.
3. Select **Download**.
4. Confirm the suggested version and select **Download** again in the confirmation dialog.
5. Wait until HACS reports that the installation has completed.

HACS should automatically create the card's JavaScript resource. You can check it under **Settings → Dashboards → Resources**. The expected URL is:

```text
/hacsfiles/myhondaplus-vehicle-card/myhondaplus-vehicle-card.js
```

The resource type must be **JavaScript module**.

### 4. Reload Home Assistant

After installing or updating the card, perform a full browser reload:

- Windows/Linux: `Ctrl + F5` or `Ctrl + Shift + R`.
- macOS: `Cmd + Shift + R`.
- Mobile app: close the app completely and open it again.

Restarting Home Assistant itself is usually not necessary.

### 5. Add the card to your dashboard

1. Open the dashboard where you want to display the vehicle.
2. Select **Edit dashboard → Add card**.
3. Search for and select **My Honda+ Vehicle Card**.
4. In the visual editor, select the vehicle and configure the name, color and visible controls.
5. Save the card and the dashboard.

You can also add it manually using YAML:

```yaml
type: custom:myhondaplus-vehicle-card
device: DEVICE_ID
```

Most settings are available in the visual editor, so you normally do not need to find or copy the device identifier.

## Project responsibilities

| Project                      | Responsibility                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| My Honda+ for Home Assistant | Authentication, communication with Honda services, and creation of devices, entities and services in Home Assistant. |
| My Honda+ Vehicle Card       | Visual presentation, entity discovery and execution of services already available in Home Assistant.              |

Authentication problems, a completely missing vehicle or communication problems with Honda should be reported in the integration repository. Layout issues, failure to detect an existing entity or card functionality problems should be reported in this repository.

## Documentation

- [User guide](docs/USER_GUIDE.md)
- [Configuration reference](docs/CONFIGURATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Roadmap](ROADMAP.md)

## Development

Requires Node.js 24 or later.

```bash
npm ci
npm run check
npm run dev
```

The HACS distribution is generated as a single self-contained file at `dist/myhondaplus-vehicle-card.js`.

## Privacy and security

The card does not connect directly to Honda or store credentials. It only consumes entities and calls services already created by Home Assistant. Sensitive commands require confirmation by default, and diagnostics hide identifiers and location data.

## License

MIT. See [LICENSE](LICENSE).
