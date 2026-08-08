# AGENTS.md

Fast orientation for AI agents working on this repository. Human contributors should start with [CONTRIBUTING.md](CONTRIBUTING.md); architecture details live in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). This file summarizes the constraints that are easiest to miss when starting cold. Defer to those canonical documents when guidance overlaps.

## 1. What this repository is

My Honda+ Vehicle Card is an unofficial TypeScript, Lit and Vite Lovelace card distributed through HACS. It presents devices, entities and services created by [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

This repository owns only the dashboard experience. It does not authenticate with Honda, call Honda APIs directly or define vehicle capabilities upstream. Integration or API problems belong in the integration or its underlying library.

## 2. Core invariants

- Discover functionality from the entities that Home Assistant exposes for the selected device.
- Never enable battery, charging, climate, locking or other features from a fixed per-model list.
- The detected vehicle model controls only the illustration.
- Hide unsupported capabilities. Show a temporary unavailable state as no data rather than pretending the capability does not exist.
- Keep entity resolution, state normalization, presentation and service calls separate.
- Do not depend on undocumented Home Assistant internals.
- Preserve existing YAML configurations. New configuration fields must be optional or have a value in `DEFAULT_CONFIG`.
- Sensitive actions must retain confirmation or equivalent protection.

## 3. Where to make changes

| Task | Primary files |
|---|---|
| Card layout, metrics, statuses or controls | `src/card.ts`; normalized values in `src/vehicle-state.ts` |
| Visual editor or configuration controls | `src/editor.ts`, `src/types.ts`, `src/constants.ts` |
| Entity discovery or capability detection | `src/entity-resolver.ts`; tests in `tests/entity-resolver.test.ts` |
| Vehicle-family detection | `src/model-resolver.ts`; tests in `tests/model-resolver.test.ts` |
| Included vehicle artwork or fallback logo | `src/vehicle-art.ts`, `assets/` |
| User-visible card strings | `src/localize.ts`; tests in `tests/localize.test.ts` |
| Registration and Lovelace metadata | `src/index.ts` |
| Diagnostics and privacy filtering | `src/diagnostics.ts` |
| Public configuration documentation | `README.md`, `README.es.md`, `docs/CONFIGURATION.md` |
| Build and release behavior | `package.json`, `vite.config.ts`, `.github/workflows/` |

Keep broad discovery rules out of `card.ts`. Keep Home Assistant registry access and service calls out of `vehicle-art.ts`.

## 4. Entity and capability rules

- Prefer integration platform, device association, entity domain, stable identifiers and translation keys.
- Treat visible entity names as a secondary compatibility signal because users and Home Assistant can translate or rename them.
- Specific matches must precede generic ones. For example, Honda e:Ny1 must be checked before Honda e.
- An entity that exists but is temporarily unavailable is different from a capability that is absent.
- Every new resolver rule needs a positive case, a close non-match and fallback coverage.
- Test the bug class, not only the exact example reported by one vehicle.

## 5. Visual rules

- Use Home Assistant Material Design Icons through `ha-icon`; do not introduce emoji or unrelated icon sets.
- Use Home Assistant theme variables and preserve readable light and dark modes.
- Keep layouts responsive. Avoid fixed dimensions unless they are only a maximum or minimum inside a responsive rule such as `clamp()`.
- The Civic uses its dedicated side-view SVG. Models without dedicated artwork use the generic Honda logo.
- Color settings affect the artwork shadow, not Honda branding or body linework.
- New SVGs must be self-contained and distributable: no scripts, external images, remote fonts or linked resources.
- Preserve wheels, windows, lights and body detail when applying color effects.
- Check visual changes at narrow and wide widths and in light and dark themes.
- Respect keyboard focus, screen readers and reduced-motion preferences.

## 6. Localization and documentation

- Runtime UI supports English, Spanish and Galician. Update all locales whenever a user-visible string is added or changed.
- `README.md` is the canonical English landing page; `README.es.md` is its complete Spanish counterpart.
- Keep both READMEs structurally aligned in the same pull request. Do not update only one when shared behavior, installation steps or configuration changes.
- Update `docs/CONFIGURATION.md`, the user guide and `CHANGELOG.md` when the public contract changes.
- Documentation must continue to state that the Home Assistant integration is a prerequisite and that this card does not connect directly to Honda.

## 7. Privacy and safety

Never commit or paste VINs, coordinates, license plates, tokens, email addresses, full entity/device identifiers or other private diagnostics. Tests and screenshots must use synthetic or redacted data.

Do not weaken confirmation for unlocking or other sensitive commands. Disable duplicate actions while a service call is in progress and surface failures to the user.

## 8. Required validation

Use Node.js 24 or later.

```bash
npm ci
npm run check
npx playwright install chromium
npm run test:visual
```

`npm run check` runs Prettier verification, ESLint, strict TypeScript, Vitest and the production Vite build. Playwright covers responsive visual regressions separately; install Chromium once in a local checkout and run `npm run test:visual` for UI changes. CI and Validate must both pass before merge. Add or update tests for behavioral changes and attach light/dark screenshots for meaningful visual changes.

The HACS artifact is `dist/myhondaplus-vehicle-card.js`. Never edit it by hand. The `Build distribution` workflow regenerates and commits it on `main` after relevant source or build changes; still run the local production build to catch failures before opening a pull request.

## 9. Releases

- Follow Semantic Versioning and update `package.json`, `package-lock.json` and `CHANGELOG.md` together.
- Audit narrative documentation before publishing a version.
- The `1.x` series is stable. Preserve backward compatibility unless a future major release explicitly documents a migration.
- Releases use tags named `vX.Y.Z`. The repository also supports the connector-driven `publish/vX.Y.Z` branch flow.
- The release workflow runs installation, dependency audit, all project checks and build before attaching the HACS JavaScript file.
- Never publish when required Actions are failing.

## 10. Pull requests

Keep each pull request focused. Explain the previous behavior, the new behavior, validation performed, risks and limitations. Include screenshots for visual changes. Resolve actionable review findings and rerun checks before merging.
