# Arquitectura

Este documento explica cómo está organizado el proyecto y dónde debe incorporarse cada tipo de cambio.

## Objetivos de diseño

- Mantener la tarjeta desacoplada de nombres de entidades traducidos.
- Separar la resolución de datos, la presentación y las acciones.
- Generar un único bundle compatible con HACS.
- Evitar dependencias de componentes internos no documentados de Home Assistant.
- Mantener las acciones sensibles protegidas por confirmación.

## Estructura principal

```text
src/
├── card.ts              Componente Lit principal y experiencia de usuario
├── editor.ts            Editor visual de configuración
├── entity-resolver.ts   Descubrimiento de entidades del vehículo
├── model-resolver.ts    Detección de la familia visual Honda
├── vehicle-art.ts       Ilustraciones vectoriales y estados animados
├── constants.ts         Valores predeterminados, versión y colores
├── types.ts             Contratos TypeScript compartidos
└── index.ts             Registro del custom element y metadatos Lovelace
```

## Flujo de datos

1. Home Assistant entrega el objeto `hass` al componente.
2. La tarjeta consulta el registro de entidades del dispositivo seleccionado.
3. `entity-resolver.ts` asigna las entidades conocidas al modelo interno `EntityMap`.
4. `model-resolver.ts` determina la familia visual usando los datos del dispositivo.
5. `card.ts` convierte el estado de las entidades en métricas, estados y acciones.
6. `vehicle-art.ts` renderiza la ilustración sin acceder directamente a Home Assistant.

## Responsabilidades

### `card.ts`

Debe coordinar la interfaz, pero no contener reglas extensas de detección. Las nuevas reglas de entidades o modelos deben vivir en sus respectivos resolvedores.

### `entity-resolver.ts`

Las reglas se basan en dominio, identificadores estables y claves de traducción. Los nombres visibles solo deben actuar como señal secundaria.

### `model-resolver.ts`

Las coincidencias específicas deben aparecer antes que las genéricas. Por ejemplo, `Honda e:Ny1` debe evaluarse antes que `Honda e`.

### `vehicle-art.ts`

El renderer recibe un modelo visual ya resuelto. No debe llamar servicios ni consultar registros de Home Assistant.

### `editor.ts`

El editor solo modifica `MyHondaPlusCardConfig` y emite `config-changed`. La tarjeta debe seguir funcionando con YAML aunque el editor no se cargue.

## Compatibilidad

Los cambios en `MyHondaPlusCardConfig` deben ser opcionales o disponer de un valor en `DEFAULT_CONFIG`. No se deben eliminar claves públicas sin una versión mayor y una guía de migración.

## Pruebas

Cada nueva regla de detección debe incluir al menos:

- un caso positivo;
- un caso parecido que no deba coincidir antes;
- el comportamiento de fallback.

Los tests viven en `tests/` y se ejecutan con `npm test`.

## Distribución

Vite genera un único archivo:

```text
dist/myhondaplus-vehicle-card.js
```

El bundle debe ser autocontenido para que HACS pueda instalarlo y actualizarlo sin gestionar fragmentos adicionales.
