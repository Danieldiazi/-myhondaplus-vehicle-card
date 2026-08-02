# Guía de usuario

## Qué necesitas instalar

Esta tarjeta es la interfaz visual. No inicia sesión en Honda ni obtiene por sí misma los datos del vehículo.

Los datos proceden de la integración comunitaria [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant), que crea el dispositivo, las entidades y los servicios que utiliza la tarjeta.

El flujo es:

```text
Servicios de Honda
       ↓
My Honda+ for Home Assistant
       ↓
Dispositivos, entidades y servicios de Home Assistant
       ↓
My Honda+ Vehicle Card
```

## Requisitos

- Home Assistant con Lovelace.
- [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant) instalada, autenticada y funcionando.
- Al menos un dispositivo de vehículo con entidades disponibles.
- HACS recomendado para instalar y actualizar la tarjeta.

Antes de continuar, abre **Ajustes → Dispositivos y servicios** y verifica que la integración muestra el vehículo y sus entidades. Si el vehículo no aparece ahí, la tarjeta tampoco podrá encontrarlo.

## Instalación

### Instalar la integración

Sigue las instrucciones del repositorio [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant). Completa la autenticación y comprueba que Home Assistant recibe datos del vehículo.

### Instalar la tarjeta

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

La tarjeta no recibe ni almacena las credenciales de Honda. La autenticación pertenece exclusivamente a la integración My Honda+ y a Home Assistant.

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

- Verifica primero que My Honda+ for Home Assistant haya creado un dispositivo en Home Assistant.
- Comprueba que sus entidades no estén deshabilitadas.
- Recarga la integración y vuelve a abrir el editor de la tarjeta.

### No aparece el vehículo ni existen entidades

Este problema pertenece normalmente a la integración de datos, no a la tarjeta. Revisa la autenticación, los registros y las incidencias de [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

### Home Assistant tiene la entidad, pero la tarjeta no la detecta

Este problema sí corresponde a la tarjeta:

- activa el diagnóstico anonimizado;
- configura temporalmente la entidad mediante `entities`;
- abre una incidencia en este repositorio sin incluir VIN, coordenadas, tokens ni estados privados.

### Falta una métrica o un estado

- Revisa si la integración expone esa entidad para tu modelo.
- Configura una entidad manual en `entities`.
- Abre una incidencia incluyendo nombres de entidades anonimizados.

### El modelo visual no es correcto

Selecciona manualmente `vehicle_model` en el editor o en YAML. La detección automática utiliza el nombre y el modelo del dispositivo, que pueden variar entre instalaciones.

### HACS no muestra una actualización

- Comprueba que exista una release publicada con un tag de versión.
- Actualiza la información de HACS.
- Reinicia Home Assistant únicamente si la recarga del navegador no es suficiente.

## Dónde solicitar ayuda

| Problema | Repositorio adecuado |
|---|---|
| Inicio de sesión, autenticación o conexión con Honda | My Honda+ for Home Assistant |
| El vehículo o todas sus entidades no aparecen en Home Assistant | My Honda+ for Home Assistant |
| Una entidad existente no se detecta correctamente | My Honda+ Vehicle Card |
| Diseño, traducción, editor o controles de la tarjeta | My Honda+ Vehicle Card |

Al abrir una incidencia sobre la tarjeta, incluye:

- versión de Home Assistant;
- versión de My Honda+ for Home Assistant;
- versión de la tarjeta;
- navegador o aplicación utilizada;
- configuración YAML sin datos privados;
- diagnóstico anonimizado;
- captura del error de la consola, cuando exista.
