# My Honda+ Vehicle Card

Tarjeta Lovelace no oficial para los vehículos conectados mediante la integración [My Honda+](https://github.com/enricobattocchi/myhondaplus-homeassistant).

## Funciones

- Selección del dispositivo desde el editor visual de Home Assistant.
- Detección automática de las entidades pertenecientes al vehículo.
- Ilustración del coche recoloreable mediante selector de color.
- Imagen personalizada opcional.
- Autonomía, batería y kilometraje.
- Estado de puertas, ventanas, maletero, capó y luces.
- Controles de cierre, climatización, ubicación y actualización desde el coche.
- Confirmación antes de desbloquear las puertas.
- Aviso cuando los datos están desactualizados.
- Diseño adaptable a móvil y escritorio.

## Instalación con HACS

1. Abre HACS.
2. Entra en **Frontend**.
3. Añade este repositorio como repositorio personalizado de tipo **Dashboard**.
4. Instala **My Honda+ Vehicle Card**.
5. Recarga el navegador.

## Configuración mínima

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
vehicle_color: "#a51d2d"
```

## Imagen propia

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
image_mode: custom
vehicle_image: /local/coches/mi-civic.png
```

## Desarrollo

```bash
npm install
npm run build
```

El archivo distribuible se genera en `dist/myhondaplus-vehicle-card.js`.

## Estado

Versión inicial en desarrollo. La ilustración incluida es genérica; el color exterior se selecciona manualmente porque la API de Honda no expone de forma fiable el color real.

## Licencia

MIT.
