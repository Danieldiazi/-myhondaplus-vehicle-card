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
├── integration-discovery.ts Descubrimiento compartido de integración y vehículos
├── entity-resolver.ts   Descubrimiento de entidades del vehículo
├── model-resolver.ts    Detección de la familia visual Honda
├── vehicle-art.ts       Ilustraciones vectoriales y estados animados
├── constants.ts         Valores predeterminados, versión y colores
├── types.ts             Contratos TypeScript compartidos
└── index.ts             Registro del custom element y metadatos Lovelace
```

## Flujo de datos

1. Home Assistant entrega el objeto `hass` al componente.
2. La tarjeta consulta los registros de dispositivos y entidades.
3. `integration-discovery.ts` comprueba la integración, los vehículos y el dispositivo seleccionado tanto para la tarjeta como para el editor.
4. `entity-resolver.ts` asigna las entidades conocidas al modelo interno `EntityMap`.
5. La presencia de esas entidades determina las capacidades visibles; el modelo del coche no activa funciones.
6. `model-resolver.ts` determina exclusivamente la familia visual usando los datos del dispositivo.
7. `card.ts` convierte el estado de las entidades en métricas, estados y acciones.
8. `vehicle-art.ts` renderiza la ilustración sin acceder directamente a Home Assistant.

## Responsabilidades

### `card.ts`

Debe coordinar la interfaz, pero no contener reglas extensas de detección. Las nuevas reglas de entidades o modelos deben vivir en sus respectivos resolvedores.

### `entity-resolver.ts`

Las reglas se basan en la plataforma `myhondaplus`, el dispositivo, el dominio, identificadores estables y claves de traducción. Los nombres visibles solo deben actuar como señal secundaria. Una capacidad inexistente no debe representarse como un estado inactivo.

### `integration-discovery.ts`

Centraliza la detección que comparten la tarjeta y el editor. Debe distinguir entre integración no cargada, ausencia de vehículos, dispositivo seleccionado inexistente y vehículo sin entidades compatibles.

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

Los tests unitarios viven en `tests/` y se ejecutan con `npm test`. Los escenarios de interfaz viven en `tests/visual/` y se ejecutan con `npm run test:visual`.

## Distribución

Vite genera un único archivo:

```text
dist/myhondaplus-vehicle-card.js
```

El bundle debe ser autocontenido para que HACS pueda instalarlo y actualizarlo sin gestionar fragmentos adicionales.
