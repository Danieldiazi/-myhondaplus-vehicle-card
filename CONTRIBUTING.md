# Contribuir

Gracias por mejorar My Honda+ Vehicle Card. Este documento resume el flujo de trabajo y los criterios de calidad del proyecto.

## Preparación

Requiere Node.js 24 o posterior.

```bash
npm install
npm run check
```

## Flujo recomendado

1. Crea una rama desde `main`.
2. Mantén el cambio pequeño y centrado en un único objetivo.
3. Añade o actualiza tests cuando cambie el comportamiento.
4. Actualiza la documentación pública si cambia la configuración.
5. Ejecuta `npm run check`.
6. Incluye el archivo generado de `dist/` cuando el bundle cambie.
7. Abre un pull request explicando el problema, la solución y la validación realizada.

## Comandos

| Comando | Propósito |
|---|---|
| `npm run dev` | Recompila el bundle al detectar cambios |
| `npm run format` | Aplica Prettier |
| `npm run lint` | Ejecuta ESLint |
| `npm run typecheck` | Comprueba TypeScript estricto |
| `npm test` | Ejecuta Vitest |
| `npm run build` | Genera el bundle HACS |
| `npm run check` | Ejecuta todas las comprobaciones anteriores |

## Buenas prácticas

- Usa TypeScript estricto y evita `any` salvo que exista una justificación documentada.
- Mantén las funciones pequeñas y con una única responsabilidad.
- Extrae las reglas de detección a los resolvedores; no las mezcles con el renderizado.
- Prefiere nombres que expresen intención frente a comentarios que repitan el código.
- Documenta con TSDoc las funciones exportadas cuyo contrato no resulte evidente.
- No dependas de componentes internos no documentados de Home Assistant.
- Conserva compatibilidad con configuraciones YAML existentes.
- Toda opción nueva debe ser opcional o disponer de un valor en `DEFAULT_CONFIG`.
- Las acciones sensibles deben mantener confirmación o una protección equivalente.

## Tests

Cada corrección de un bug debería añadir un test que falle antes del cambio y pase después. Las reglas de detección deben probar coincidencias específicas, casos parecidos y fallback.

## Commits y pull requests

Usa mensajes breves en modo imperativo, por ejemplo:

```text
fix: detect Honda e:Ny1 before Honda e
feat: add charging status indicator
docs: explain manual entity overrides
```

El pull request debe incluir:

- contexto del problema;
- comportamiento anterior y nuevo;
- pruebas realizadas;
- capturas cuando el cambio sea visual;
- posibles riesgos o limitaciones.

## Privacidad

No incluyas VIN, coordenadas, matrículas, tokens, correos ni otros datos privados en código, tests, logs, capturas o incidencias.

Consulta también [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
