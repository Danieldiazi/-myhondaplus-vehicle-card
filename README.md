# My Honda+ Vehicle Card

Tarjeta Lovelace no oficial, moderna y configurable para los vehículos conectados mediante [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

> Proyecto comunitario, no afiliado a Honda Motor Co., Ltd.

## Características

- Selector visual del vehículo, sin copiar identificadores internos.
- Detección automática de entidades por dispositivo, dominio y claves estables.
- Ilustración recoloreable con colores de fábrica y color personalizado.
- Imagen propia opcional.
- Autonomía, batería y kilometraje.
- Puertas, ventanas, maletero, capó y luces.
- Cierre, climatización, actualización y ubicación.
- Confirmación antes de desbloquear.
- Diseño completo o compacto y adaptación móvil.
- Código TypeScript con Lit, Vite, tests, lint y CI.

## Instalación con HACS

1. Abre **HACS → Frontend**.
2. Añade `https://github.com/Danieldiazi/myhondaplus-vehicle-card` como repositorio personalizado de tipo **Dashboard**.
3. Instala **My Honda+ Vehicle Card**.
4. Recarga el navegador.
5. Añade una tarjeta y selecciona **My Honda+ Vehicle Card**.

## Configuración mínima

La configuración habitual se realiza desde el editor visual:

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
color_preset: rallye_red
```

## Imagen personalizada

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
image_mode: custom
vehicle_image: /local/coches/mi-civic.png
```

## Desarrollo

Requiere Node.js 20 o posterior.

```bash
npm install
npm run check
npm run dev
```

La distribución HACS se genera en `dist/myhondaplus-vehicle-card.js`.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) y [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## Estado

La tarjeta está en desarrollo activo. La ilustración actual es una base vectorial recoloreable; están previstas ilustraciones específicas por modelo.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
