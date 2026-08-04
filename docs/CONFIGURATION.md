# Configuración

## Origen de los datos

La tarjeta no consulta directamente los servicios de Honda. Utiliza los dispositivos, entidades y servicios creados en Home Assistant por [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

Debes instalar y configurar esa integración antes de añadir la tarjeta. El valor de `device` corresponde al identificador del dispositivo creado por la integración en el registro de dispositivos de Home Assistant.

```text
My Honda+ for Home Assistant → dispositivo y entidades → My Honda+ Vehicle Card
```

## Opciones

| Opción              | Tipo                        | Predeterminado | Descripción                                                                                      |
| ------------------- | --------------------------- | -------------: | ------------------------------------------------------------------------------------------------ |
| `device`            | string                      |              — | ID del dispositivo creado por My Honda+ for Home Assistant. El editor lo selecciona visualmente. |
| `name`              | string                      |    `My Honda+` | Nombre mostrado.                                                                                 |
| `color_preset`      | string                      |   `rallye_red` | Color predefinido de la sombra de la ilustración.                                                |
| `vehicle_color`     | string                      |      `#a51d2d` | Color de sombra hexadecimal cuando el preset es `custom`.                                        |
| `image_mode`        | `rendered` / `custom`       |     `rendered` | Ilustración incluida o imagen propia.                                                            |
| `vehicle_image`     | string                      |              — | URL de la imagen personalizada.                                                                  |
| `vehicle_scale`     | number                      |          `100` | Escala de la ilustración, entre 70 y 140 %.                                                      |
| `vehicle_alignment` | `left` / `center` / `right` |       `center` | Alineación horizontal de la ilustración.                                                         |
| `vehicle_shadow`    | boolean                     |         `true` | Activa la sombra de color de la ilustración.                                                     |
| `shadow_intensity`  | number                      |           `60` | Intensidad de la sombra, entre 0 y 100 %.                                                        |
| `layout`            | `full` / `compact`          |         `full` | Densidad visual.                                                                                 |
| `stale_after`       | number                      |        `21600` | Segundos antes de marcar los datos como antiguos.                                                |
| `show_controls`     | boolean                     |         `true` | Muestra los botones de acción.                                                                   |
| `confirm_unlock`    | boolean                     |         `true` | Solicita confirmación antes de abrir.                                                            |
| `locale`            | `auto` / `es` / `en` / `gl` |         `auto` | Idioma de la tarjeta. `auto` utiliza el idioma de Home Assistant.                                |
| `debug`             | boolean                     |        `false` | Muestra el diagnóstico anonimizado.                                                              |
| `controls`          | array                       |    compatibles | Controles preferidos y su orden. Los que no tengan entidad se ocultan.                           |
| `metrics`           | array                       |    compatibles | Métricas preferidas y su orden. Las que no tengan entidad se ocultan.                            |
| `entities`          | object                      |     automático | Sobrescritura avanzada de entidades detectadas.                                                  |

Cuando `image_mode` es `custom` y `vehicle_image` no puede cargarse, la tarjeta muestra el logo genérico de Honda y un aviso localizado. La URL se mantiene en la configuración para que pueda corregirse desde el editor.

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

## Detección de capacidades

La tarjeta no asigna funciones por modelo. El modelo visual solo selecciona la ilustración; las capacidades se obtienen de las entidades activas de la plataforma `myhondaplus` asociadas al dispositivo.

- Si una entidad no existe, su métrica, estado o control se oculta.
- Si existe pero está `unknown` o `unavailable`, se muestra como **Sin datos** y los controles no disponibles se desactivan.
- Si existe y tiene un estado válido, se muestra y puede utilizarse.
- La batería solo se reconoce mediante claves específicas de batería de tracción; un nombre genérico no basta.

Las métricas disponibles incluyen autonomía, batería, kilometraje, distancia mensual, consumo medio y tiempo de conducción. Los controles incluyen cierre, climatización, bocina y luces, actualización almacenada, actualización desde el coche y ubicación, siempre que la integración publique la entidad correspondiente.

## Límites de responsabilidad

La tarjeta solo puede representar funciones que la integración haya publicado como entidades o servicios en Home Assistant. Una métrica que no exista en el dispositivo no puede ser obtenida directamente por la tarjeta.

- Cuando el vehículo o las entidades no aparecen en Home Assistant, revisa la integración My Honda+.
- Cuando las entidades existen pero la tarjeta no las reconoce, utiliza el diagnóstico y abre una incidencia en este repositorio.
- Nunca incluyas VIN, credenciales, tokens o coordenadas en una configuración compartida o en una incidencia pública.
