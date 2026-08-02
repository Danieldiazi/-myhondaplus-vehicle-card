# My Honda+ Vehicle Card

Tarjeta Lovelace no oficial, moderna y configurable para vehículos conectados mediante [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

> Proyecto comunitario, no afiliado a Honda Motor Co., Ltd.

## Características

- Selector visual del vehículo, sin copiar identificadores internos.
- Detección automática de entidades por dispositivo, dominio y claves estables.
- Detección automática de Honda Civic, HR-V, CR-V, ZR-V, Jazz, Honda e y e:Ny1.
- Renderer vectorial adaptable a la familia del vehículo.
- Colores Honda predefinidos, efecto perlado y color personalizado.
- Imagen propia opcional.
- Autonomía, batería, kilometraje y antigüedad de los datos.
- Puertas, ventanas, maletero, capó, luces y estado de carga.
- Cierre, climatización, actualización y ubicación.
- Animaciones para carga, climatización y luces.
- Confirmación antes de desbloquear.
- Diseño completo o compacto, responsive y compatible con modo oscuro.
- TypeScript, Lit, Vite, Vitest, ESLint y GitHub Actions.

## Instalación con HACS

1. Abre **HACS → Frontend**.
2. Añade `https://github.com/Danieldiazi/myhondaplus-vehicle-card` como repositorio personalizado de tipo **Dashboard**.
3. Instala **My Honda+ Vehicle Card**.
4. Recarga completamente el navegador.
5. Añade una tarjeta y selecciona **My Honda+ Vehicle Card**.

## Configuración mínima

La configuración habitual se realiza desde el editor visual:

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
color_preset: rallye_red
vehicle_model: auto
```

## Personalización visual

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
name: Mi Civic
vehicle_model: civic
color_preset: platinum_white
layout: full
animate: true
show_model: true
```

## Imagen personalizada

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
image_mode: custom
vehicle_image: /local/coches/mi-civic.png
```

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

## Desarrollo

Requiere Node.js 20 o posterior.

```bash
npm install
npm run check
npm run dev
```

La distribución HACS se genera como un único archivo autocontenido en `dist/myhondaplus-vehicle-card.js`.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md), [docs/CONFIGURATION.md](docs/CONFIGURATION.md) y [ROADMAP.md](ROADMAP.md).

## Privacidad y seguridad

La tarjeta no se conecta directamente a Honda ni almacena credenciales. Solo consume entidades ya creadas por Home Assistant. Los comandos sensibles, como desbloquear puertas, requieren confirmación de forma predeterminada.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
