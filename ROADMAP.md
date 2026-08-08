# Roadmap

Este documento refleja la base estable publicada como `v1.0.0`. Las próximas prioridades pueden ajustarse según las entidades que publique My Honda+ for Home Assistant y las pruebas aportadas por propietarios de distintos modelos.

## Versión estable — v1.0.0

- Tarjeta TypeScript, Lit y Vite distribuida mediante HACS.
- Descubrimiento de la integración, vehículos, entidades y capacidades reales.
- Métricas, estados y controles adaptados a las entidades publicadas por cada vehículo.
- Configuración visual de métricas, estados y acciones, incluido el orden de los estados.
- Diseños completo y compacto, responsive y compatibles con temas claro y oscuro.
- Ilustración específica para Civic y logo Honda como alternativa estable para otros modelos.
- Apertura del diálogo nativo de Home Assistant desde métricas, estados, cierre y fecha de actualización.
- Confirmaciones configurables y advertencias antes de acciones remotas con datos antiguos.
- Editor visual, diagnóstico anonimizado y traducciones en español, inglés y gallego.
- Pruebas unitarias, visuales, de compilación y validación oficial de HACS.
- Releases automáticas y solicitud de inclusión en el índice predeterminado de HACS.

## Próximas mejoras

- Guía y plantilla SVG para aportar ilustraciones de nuevos modelos.
- Galería de capturas con datos sintéticos o anonimizados.
- Validación documentada con más modelos Honda y versiones recientes de Home Assistant.
- Mejoras de accesibilidad y adaptación a nuevos componentes visuales públicos de Home Assistant.
- Ampliación de pruebas de migración para configuraciones procedentes de versiones `0.x`.

## Datos avanzados — sujetos a disponibilidad

Estas funciones solo se incorporarán cuando la integración publique entidades estables que permitan implementarlas sin consultar directamente los servicios de Honda:

- Hora estimada de finalización de carga.
- Historial resumido de autonomía y batería utilizando datos de Home Assistant.
- Resúmenes de trayectos adicionales.
- Acceso mejorado a la ubicación sin registrar ni exponer coordenadas.

## Política para la serie 1.x

- Las actualizaciones compatibles con nuevas funciones incrementarán la versión menor.
- Las correcciones compatibles incrementarán el parche.
- Los cambios incompatibles requerirán una versión mayor y una guía de migración.
- La ausencia de una ilustración específica no bloquea una versión estable: el logo Honda es el fallback oficial para esos modelos.

## Fuera de alcance

- Autenticarse directamente contra Honda o almacenar credenciales.
- Inventar capacidades según el modelo cuando Home Assistant no expone la entidad correspondiente.
- Convertir este repositorio en una tarjeta multimarca. Una solución multimarca requeriría otro proyecto y un contrato de proveedores independiente.
