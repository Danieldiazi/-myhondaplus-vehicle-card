# My Honda+ Vehicle Card

Tarjeta Lovelace no oficial para mostrar y controlar vehículos conectados mediante [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

> Proyecto comunitario, no afiliado a Honda Motor Co., Ltd.

## Lo más destacado

- Configuración visual con descubrimiento automático del vehículo.
- Diseños específicos para Civic, HR-V, CR-V, ZR-V, Jazz, Honda e y e:Ny1.
- Métricas y controles configurables.
- Español, inglés y gallego con selección automática de idioma.
- Diagnóstico anonimizado para solicitar soporte sin compartir VIN, coordenadas ni identificadores completos.
- Estados de puertas, ventanas, maletero, capó, luces, carga y climatización.
- Diseño responsive, modo oscuro, foco de teclado y reducción automática de movimiento.
- Confirmación antes de desbloquear y bloqueo de acciones duplicadas.

## Instalación rápida

1. Abre **HACS → Frontend**.
2. Añade `https://github.com/Danieldiazi/myhondaplus-vehicle-card` como repositorio personalizado de tipo **Dashboard**.
3. Instala **My Honda+ Vehicle Card**.
4. Recarga completamente el navegador.
5. Añade una tarjeta y selecciona **My Honda+ Vehicle Card**.

La configuración mínima es:

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
```

La mayor parte de la configuración se puede realizar desde el editor visual.

## Documentación

- [Guía de usuario](docs/USER_GUIDE.md)
- [Referencia de configuración](docs/CONFIGURATION.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Cómo contribuir](CONTRIBUTING.md)
- [Historial de cambios](CHANGELOG.md)
- [Roadmap](ROADMAP.md)

## Desarrollo

Requiere Node.js 24 o posterior.

```bash
npm install
npm run check
npm run dev
```

La distribución HACS se genera como un único archivo autocontenido en `dist/myhondaplus-vehicle-card.js`.

## Privacidad y seguridad

La tarjeta no se conecta directamente a Honda ni almacena credenciales. Solo consume entidades ya creadas por Home Assistant. Los comandos sensibles requieren confirmación de forma predeterminada y los diagnósticos ocultan identificadores y datos de localización.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
