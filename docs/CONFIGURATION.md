# Configuración

| Opción | Tipo | Predeterminado | Descripción |
|---|---|---:|---|
| `device` | string | — | ID del dispositivo My Honda+. El editor lo selecciona visualmente. |
| `name` | string | `My Honda+` | Nombre mostrado. |
| `color_preset` | string | `rallye_red` | Color predefinido de la carrocería. |
| `vehicle_color` | string | `#a51d2d` | Color hexadecimal cuando el preset es `custom`. |
| `image_mode` | `rendered` / `custom` | `rendered` | Ilustración recoloreable o imagen propia. |
| `vehicle_image` | string | — | URL de la imagen personalizada. |
| `layout` | `full` / `compact` | `full` | Densidad visual. |
| `stale_after` | number | `21600` | Segundos antes de marcar los datos como antiguos. |
| `show_controls` | boolean | `true` | Muestra los botones de acción. |
| `confirm_unlock` | boolean | `true` | Solicita confirmación antes de abrir. |
| `entities` | object | automático | Sobrescritura avanzada de entidades detectadas. |

## Sobrescritura de entidades

```yaml
entities:
  range: sensor.civic_total_range
  lock: lock.civic_doors
  location: device_tracker.civic_location
```

La detección automática usa el dispositivo, el dominio de Home Assistant y claves estables de la integración. Las sobrescrituras siempre tienen prioridad.
