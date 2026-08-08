# Roadmap

Este documento refleja el estado del proyecto a partir de `v0.9.1`. Las versiones concretas pueden ajustarse según las entidades que publique My Honda+ for Home Assistant y las pruebas aportadas por propietarios de distintos modelos.

## Estado actual — v0.9.1

- Tarjeta TypeScript, Lit y Vite distribuida mediante HACS.
- Descubrimiento de la integración, vehículos, entidades y capacidades reales.
- Métricas, estados y controles adaptados a las entidades publicadas por cada vehículo.
- Diseños completo y compacto, responsive y compatibles con temas claro y oscuro.
- Ilustración específica para Civic y logo Honda como alternativa para otros modelos.
- Editor visual, diagnóstico anonimizado y traducciones en español, inglés y gallego.
- Apertura del diálogo nativo de Home Assistant desde métricas, estados, cierre y fecha de actualización.
- Pruebas unitarias, visuales, de compilación y validación oficial de HACS.
- Releases automáticas y solicitud de inclusión en el índice predeterminado de HACS.

## Próxima versión menor — en desarrollo

- Configuración de visibilidad y orden de puertas, ventanas, maletero, capó, luces, carga, climatización y ubicación.
- Indicadores visuales coherentes para todos los bloques que abren más información.
- Confirmaciones opcionales para climatización, bocina y luces y actualización desde el coche.
- Advertencia antes de acciones remotas cuando la información mostrada está desactualizada.
- Guía y plantilla SVG para aportar ilustraciones de nuevos modelos.
- Galería de capturas con datos sintéticos o anonimizados.

## Datos avanzados — sujetos a disponibilidad

Estas funciones solo se incorporarán cuando la integración publique entidades estables que permitan implementarlas sin consultar directamente los servicios de Honda:

- Hora estimada de finalización de carga.
- Historial resumido de autonomía y batería utilizando datos de Home Assistant.
- Resúmenes de trayectos adicionales.
- Acceso mejorado a la ubicación sin registrar ni exponer coordenadas.

## Qué falta para v1.0.0

No se publicará `v1.0.0` sin aprobación expresa del mantenedor y hasta completar una parte suficiente de estas condiciones:

- Compatibilidad funcional validada con varios modelos Honda y versiones recientes de Home Assistant.
- Cobertura visual suficiente o un proceso comunitario consolidado para aportar ilustraciones.
- Pruebas documentadas de migración de configuraciones antiguas.
- Proceso de contribución, documentación y releases consolidado.
- Resolución de la solicitud de inclusión en el índice predeterminado de HACS.
- Ausencia de regresiones relevantes durante un periodo razonable de uso.

## Fuera de alcance

- Autenticarse directamente contra Honda o almacenar credenciales.
- Inventar capacidades según el modelo cuando Home Assistant no expone la entidad correspondiente.
- Convertir este repositorio en una tarjeta multimarca. Una solución multimarca requeriría otro proyecto y un contrato de proveedores independiente.
