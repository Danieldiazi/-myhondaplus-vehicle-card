# Contribuir

## Preparación

```bash
npm install
npm run check
```

## Flujo recomendado

1. Crea una rama desde `main`.
2. Mantén los cambios pequeños y enfocados.
3. Añade o actualiza tests.
4. Ejecuta `npm run check`.
5. Incluye el archivo generado de `dist/`.
6. Abre un pull request explicando el cambio y cómo se validó.

## Convenciones

- TypeScript estricto.
- Componentes Lit sin depender de componentes internos no documentados de Home Assistant.
- Entidades identificadas por dominio y claves estables, no solo por nombres traducidos.
- Acciones sensibles con confirmación.
- No incluir VIN, coordenadas, tokens ni otros datos privados en logs o ejemplos.
