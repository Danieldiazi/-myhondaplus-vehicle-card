# Guía de usuario

## Requisitos

- Home Assistant con Lovelace.
- La integración comunitaria My Honda+ instalada y funcionando.
- Al menos un dispositivo de vehículo con entidades disponibles.
- HACS recomendado para instalar y actualizar la tarjeta.

## Instalación

1. Abre **HACS → Frontend**.
2. Añade `https://github.com/Danieldiazi/myhondaplus-vehicle-card` como repositorio personalizado de tipo **Dashboard**.
3. Instala **My Honda+ Vehicle Card**.
4. Recarga completamente el navegador o la aplicación de Home Assistant.
5. Añade una tarjeta y selecciona **My Honda+ Vehicle Card**.

## Configuración desde el editor

El editor visual permite elegir el vehículo, el modelo, el color, el diseño y los controles visibles. En la mayoría de los casos no es necesario editar YAML.

Configuración mínima equivalente:

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
```

## Configuraciones habituales

### Diseño compacto

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
layout: compact
```

### Sin animaciones

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
animate: false
```

### Imagen personalizada

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
image_mode: custom
vehicle_image: /local/coches/mi-civic.png
```

### Entidades manuales

La detección automática puede sobrescribirse para instalaciones con nombres o entidades especiales:

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
entities:
  lock: lock.mi_honda
  range: sensor.mi_honda_autonomia
  battery: sensor.mi_honda_bateria
  refresh: button.mi_honda_actualizar
```

## Seguridad

La opción `confirm_unlock` está activada de forma predeterminada. Al pulsar el control para desbloquear, la tarjeta solicita confirmación antes de llamar al servicio de Home Assistant.

```yaml
confirm_unlock: true
```

No se recomienda desactivarla en paneles compartidos o accesibles desde una pared.

## Datos desactualizados

`stale_after` define cuántos segundos pueden transcurrir antes de marcar los datos como antiguos. El valor predeterminado es seis horas.

```yaml
stale_after: 21600
```

Este aviso no fuerza una actualización del vehículo; solo informa sobre la antigüedad del último dato disponible.

## Resolución de problemas

### La tarjeta no aparece

- Confirma que el recurso está instalado en HACS.
- Recarga el navegador sin caché.
- Comprueba que el tipo sea `custom:myhondaplus-vehicle-card`.

### No se encuentra ningún vehículo

- Verifica primero que la integración My Honda+ haya creado un dispositivo.
- Comprueba que sus entidades no estén deshabilitadas.
- Recarga la integración y vuelve a abrir el editor de la tarjeta.

### Falta una métrica o un estado

- Revisa si la integración expone esa entidad para tu modelo.
- Configura una entidad manual en `entities`.
- Abre una incidencia incluyendo nombres de entidades anonimizados, nunca VIN, coordenadas ni tokens.

### El modelo visual no es correcto

Selecciona manualmente `vehicle_model` en el editor o en YAML. La detección automática utiliza el nombre y el modelo del dispositivo, que pueden variar entre instalaciones.

### HACS no muestra una actualización

- Comprueba que exista una release publicada con un tag de versión.
- Actualiza la información de HACS.
- Reinicia Home Assistant únicamente si la recarga del navegador no es suficiente.

## Solicitar ayuda

Al abrir una incidencia, incluye:

- versión de Home Assistant;
- versión de la tarjeta;
- navegador o aplicación utilizada;
- configuración YAML sin datos privados;
- nombres de entidades anonimizados;
- captura del error de la consola, si existe.
