# My Honda+ Vehicle Card

Tarjeta Lovelace no oficial para mostrar y controlar vehículos conectados mediante la integración comunitaria [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant).

> Este repositorio contiene únicamente la tarjeta del panel. **No se conecta directamente a los servicios de Honda.** Para obtener los datos del vehículo es necesario instalar y configurar previamente la integración My Honda+ enlazada arriba.
>
> Proyecto comunitario, no afiliado a Honda Motor Co., Ltd. ni al autor de la integración de Home Assistant.

## Requisitos

Antes de instalar la tarjeta necesitas:

1. Home Assistant con un panel Lovelace.
2. La integración [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant) instalada y funcionando.
3. Al menos un vehículo y sus entidades disponibles en Home Assistant.
4. HACS, recomendado para instalar y actualizar esta tarjeta.

La integración obtiene y publica los datos como dispositivos y entidades de Home Assistant. Esta tarjeta se limita a descubrir, representar y accionar esas entidades.

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

### 1. Instala la integración de datos

Instala y configura [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant). Comprueba en **Ajustes → Dispositivos y servicios** que Home Assistant muestra el vehículo y sus entidades.

### 2. Instala esta tarjeta

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

## Responsabilidad de cada proyecto

| Proyecto | Responsabilidad |
|---|---|
| My Honda+ for Home Assistant | Autenticación, comunicación con los servicios de Honda y creación de dispositivos, entidades y servicios en Home Assistant. |
| My Honda+ Vehicle Card | Presentación visual, detección de entidades y ejecución de servicios ya disponibles en Home Assistant. |

Los problemas de autenticación, ausencia completa del vehículo o comunicación con Honda deben notificarse en el repositorio de la integración. Los problemas de diseño, detección de una entidad existente o funcionamiento de la tarjeta deben notificarse en este repositorio.

## Documentación

- [Guía de usuario](docs/USER_GUIDE.md)
- [Referencia de configuración](docs/CONFIGURATION.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Cómo contribuir](CONTRIBUTING.md)
- [Política de seguridad](SECURITY.md)
- [Historial de cambios](CHANGELOG.md)
- [Roadmap](ROADMAP.md)

## Desarrollo

Requiere Node.js 24 o posterior.

```bash
npm ci
npm run check
npm run dev
```

La distribución HACS se genera como un único archivo autocontenido en `dist/myhondaplus-vehicle-card.js`.

## Privacidad y seguridad

La tarjeta no se conecta directamente a Honda ni almacena credenciales. Solo consume entidades y llama a servicios ya creados por Home Assistant. Los comandos sensibles requieren confirmación de forma predeterminada y los diagnósticos ocultan identificadores y datos de localización.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
