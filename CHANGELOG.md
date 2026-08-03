# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El proyecto sigue [Semantic Versioning](https://semver.org/):

- `PATCH`: correcciones compatibles;
- `MINOR`: funciones nuevas compatibles;
- `MAJOR`: cambios incompatibles de configuración o comportamiento.

## [Unreleased]

### Added

- Instalaciones reproducibles mediante `package-lock.json` y `npm ci`.
- Auditoría de dependencias de producción en CI y releases.
- Política de seguridad en `SECURITY.md`.
- Documentación explícita de la dependencia de My Honda+ for Home Assistant y de los límites de responsabilidad entre integración y tarjeta.
- Detección dinámica de métricas, estados y controles según las entidades reales del vehículo.
- Métricas mensuales de distancia, consumo y tiempo de conducción.
- Controles de bocina y luces y actualización de datos almacenados cuando estén disponibles.
- Escala, alineación y sombra configurables para la ilustración.
- Licencia MIT incluida en el repositorio.

### Changed

- GitHub Actions fijadas mediante SHA completos.
- Flujo de publicación actualizado para Node.js 24.
- README, guía de usuario y referencia de configuración ampliados con instalación previa de la integración y orientación de soporte.
- Estados inexistentes ocultos y entidades temporalmente no disponibles identificadas como sin datos.
- Actualizaciones menores y de parche agrupadas en Dependabot; las mayores permanecen separadas.
- Fondo de la tarjeta integrado con el tema activo de Home Assistant, sin mezclar el color primario.
- Iconos de métricas unificados con los iconos MDI nativos de Home Assistant.
- Iconos de cierre, estados y controles unificados con los iconos MDI nativos de Home Assistant.
- Logotipo genérico de Honda como fallback para modelos sin una ilustración SVG específica.
- Estado de climatización independiente de la ilustración —también en diseño compacto—, sombras de color coherentes para imágenes incluidas y personalizadas, y fallback de Honda redimensionado.

## [0.5.0] - 2026-08-02

### Added

- Traducciones al español, inglés y gallego.
- Modelo interno normalizado `VehicleState`.
- Diagnóstico anonimizado copiable.
- Métricas y controles configurables.
- Errores visibles y bloqueo de acciones en curso.
- Soporte para lectores de pantalla, foco de teclado y reducción de movimiento.
- Formularios de incidencias y plantilla de pull request.
- Dependabot para npm y GitHub Actions.
- Documentación de usuario, configuración, arquitectura y contribución.

### Changed

- Workflows actualizados a Node.js 24.
- Separación entre entidades de Home Assistant y estado visual.

## [0.4.0]

### Added

- Arquitectura TypeScript + Lit + Vite.
- Editor visual con descubrimiento de vehículos.
- Presets de color y color personalizado.
- Tests unitarios del resolvedor de entidades.
- CI y automatización de releases.
