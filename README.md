# My Honda+ Vehicle Card

Tarjeta Lovelace no oficial, moderna y configurable para vehículos conectados mediante [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

> Proyecto comunitario, no afiliado a Honda Motor Co., Ltd.

## Características

- Configuración visual sin copiar identificadores internos.
- Detección automática de entidades y modelos Honda compatibles.
- Ilustraciones vectoriales recoloreables e imagen personalizada opcional.
- Autonomía, batería, kilometraje, cierres, aperturas, luces, carga y antigüedad de datos.
- Controles para cierre, climatización, actualización y ubicación.
- Diseño completo o compacto, responsive, animado y compatible con modo oscuro.
- Confirmación antes de desbloquear.
- TypeScript estricto, Lit, Vite, Vitest, ESLint y GitHub Actions.

## Instalación rápida

1. Abre **HACS → Frontend**.
2. Añade `https://github.com/Danieldiazi/myhondaplus-vehicle-card` como repositorio personalizado de tipo **Dashboard**.
3. Instala **My Honda+ Vehicle Card**.
4. Recarga completamente el navegador.
5. Añade una tarjeta y selecciona **My Honda+ Vehicle Card**.

Configuración mínima:

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
```

Consulta la [guía de usuario](docs/USER_GUIDE.md) para personalización, entidades manuales, seguridad y resolución de problemas.

## Modelos visuales

| Valor | Modelo |
|---|---|
| `auto` | Detección automática |
| `civic` | Honda Civic |
| `hrv` | Honda HR-V |
| `crv` | Honda CR-V |
| `zrv` | Honda ZR-V |
| `jazz` | Honda Jazz |
| `honda_e` | Honda e |
| `eny1` | Honda e:Ny1 |
| `generic` | Honda genérico |

## Documentación

- [Guía de usuario](docs/USER_GUIDE.md)
- [Referencia de configuración](docs/CONFIGURATION.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Cómo contribuir](CONTRIBUTING.md)
- [Roadmap](ROADMAP.md)
- [Historial de cambios](CHANGELOG.md)

## Desarrollo

Requiere Node.js 24 o posterior.

```bash
npm install
npm run check
npm run dev
```

La distribución HACS se genera como un único archivo autocontenido en:

```text
dist/myhondaplus-vehicle-card.js
```

## Privacidad y seguridad

La tarjeta no se conecta directamente a Honda ni almacena credenciales. Solo consume entidades ya creadas por Home Assistant. Los comandos sensibles, como desbloquear puertas, requieren confirmación de forma predeterminada.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
