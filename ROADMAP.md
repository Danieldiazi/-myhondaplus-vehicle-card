# Roadmap

Este documento separa las capacidades ya entregadas de las líneas de trabajo pendientes. Las versiones concretas pueden ajustarse según las entidades que publique la integración My Honda+ y las pruebas aportadas por propietarios de distintos modelos.

## Completado en v0.4–v0.5

- Tarjeta TypeScript, Lit y Vite distribuible mediante HACS.
- Descubrimiento de vehículos y entidades de la integración `myhondaplus`.
- Capacidades visibles determinadas por las entidades reales, no por una tabla fija de modelos.
- Diseño completo y compacto, responsive, compatible con temas claro y oscuro.
- Ilustración lateral específica para Civic y logo Honda como fallback para otros modelos.
- Sombras configurables con colores Honda sin modificar el logo ni las líneas del vehículo.
- Métricas mensuales, estados del vehículo y controles remotos cuando están disponibles.
- Climatización visible también en el diseño compacto.
- Editor visual y tarjeta traducidos al español, inglés y gallego.
- Navegación por teclado, lectores de pantalla y reducción de movimiento.
- Diagnóstico anonimizado y confirmación de acciones sensibles.
- Releases versionadas, validación oficial de HACS y documentación bilingüe.
- Pruebas unitarias y visuales para los principales estados, modelos y tamaños de pantalla.

## v0.6 — Robustez y cobertura de modelos

- Resumen de capacidades detectadas dentro del editor visual.
- Confirmaciones configurables para otras acciones remotas sensibles.
- Guía y plantilla SVG para aportar ilustraciones de nuevos modelos.
- Galería de capturas reales con datos sintéticos o anonimizados.
- Validación con más modelos y versiones recientes de Home Assistant.
- Recuperación y redescubrimiento sencillo cuando cambien las entidades del vehículo.

## Datos avanzados — sujetos a disponibilidad

Estas funciones solo se incorporarán cuando la integración publique entidades estables que permitan implementarlas sin consultar directamente los servicios de Honda:

- Hora estimada de finalización de carga.
- Historial opcional de autonomía y batería usando datos de Home Assistant.
- Resúmenes de trayectos adicionales.
- Acceso mejorado a la ubicación sin registrar ni exponer coordenadas.

## v1.0 — Primera versión estable

- Compatibilidad validada con varios modelos y versiones de Home Assistant.
- Cobertura visual suficiente o proceso comunitario consolidado para aportar ilustraciones.
- Migración estable de configuraciones antiguas.
- Documentación y proceso de releases consolidados.
- Evaluación de inclusión en el índice predeterminado de HACS.

No se publicará `v1.0.0` mientras la cobertura de ilustraciones específicas siga siendo insuficiente sin aprobación expresa del mantenedor.

## Fuera de alcance

- Autenticarse directamente contra Honda o almacenar credenciales.
- Inventar capacidades según el modelo cuando Home Assistant no expone la entidad correspondiente.
- Convertir este repositorio en una tarjeta multimarca. Una solución multimarca requeriría otro proyecto y un contrato de proveedores independiente.
