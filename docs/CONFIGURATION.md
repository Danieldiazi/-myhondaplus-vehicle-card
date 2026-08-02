# Configuración

## Origen de los datos

La tarjeta no consulta directamente los servicios de Honda. Utiliza los dispositivos, entidades y servicios creados en Home Assistant por [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

Debes instalar y configurar esa integración antes de añadir la tarjeta. El valor de `device` corresponde al identificador del dispositivo creado por la integración en el registro de dispositivos de Home Assistant.

```text
My Honda+ for Home Assistant → dispositivo y entidades → My Honda+ Vehicle Card
```

## Opciones

| Opción | Tipo | Predeterminado | Descripción |
|---|---|---:|---|
| `device` | string | — | ID del dispositivo creado por My Honda+ for Home Assistant. El editor lo selecciona visualmente. |
| `name` | string | `My Honda+` | Nombre mostrado. |
| `color_preset` | string | `rallye_red` | Color predefinido de la carrocería. |
| `vehicle_color` | string | `#a51d2d` | Color hexadecimal cuando el preset es `custom`. |
| `image_mode` | `rendered` / `custom` | `rendered` | Ilustración recoloreable o imagen propia. |
| `vehicle_image` | string | — | URL de la imagen personalizada. |
| `layout` | `full` / `compact` | `full` | Densidad visual. |
| `stale_after` | number | `21600` | Segundos antes de marcar los datos como antiguos. |
| `show_controls` | boolean | `true` | Muestra los botones de acción. |
| `confirm_unlock` | boolean | `true` | Solicita confirmación antes de abrir. |
| `locale` | `auto` / `es` / `en` / `gl` | `auto` | Idioma de la tarjeta. `auto` utiliza el idioma de Home Assistant. |
| `debug` | boolean | `false` | Muestra el diagnóstico anonimizado. |
| `controls` | array | todos | Controles visibles y su orden. |
| `metrics` | array | todas | Métricas visibles y su orden. |
| `entities` | object | automático | Sobrescritura avanzada de entidades detectadas. |

## Configuración mínima

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO_CREADO_POR_LA_INTEGRACION
```

El editor visual obtiene la lista desde el registro de dispositivos de Home Assistant, por lo que normalmente no necesitas copiar el identificador manualmente.

## Sobrescritura de entidades

```yaml
entities:
  range: sensor.civic_total_range
  lock: lock.civic_doors
  location: device_tracker.civic_location
```

La detección automática usa el dispositivo, el dominio de Home Assistant y claves estables expuestas por My Honda+ for Home Assistant. Las sobrescrituras siempre tienen prioridad.

## Límites de responsabilidad

La tarjeta solo puede representar funciones que la integración haya publicado como entidades o servicios en Home Assistant. Una métrica que no exista en el dispositivo no puede ser obtenida directamente por la tarjeta.

- Cuando el vehículo o las entidades no aparecen en Home Assistant, revisa la integración My Honda+.
- Cuando las entidades existen pero la tarjeta no las reconoce, utiliza el diagnóstico y abre una incidencia en este repositorio.
- Nunca incluyas VIN, credenciales, tokens o coordenadas en una configuración compartida o en una incidencia pública.
