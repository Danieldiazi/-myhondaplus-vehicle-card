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
- Ilustración específica para Civic y una ilustración genérica cuidada para el resto de modelos.
- Contenido adaptado automáticamente a las entidades que cada vehículo publica en Home Assistant.
- Métricas y controles configurables.
- Español, inglés y gallego con selección automática de idioma.
- Diagnóstico anonimizado para solicitar soporte sin compartir VIN, coordenadas ni identificadores completos.
- Estados de puertas, ventanas, maletero, capó, luces, carga y climatización.
- Diseño responsive, modo oscuro, foco de teclado y reducción automática de movimiento.
- Confirmación antes de desbloquear y bloqueo de acciones duplicadas.

## Compatibilidad visual y funcional

| Modelo                                  | Ilustración            | Información y controles                  |
| --------------------------------------- | ---------------------- | ---------------------------------------- |
| Honda Civic                             | SVG lateral específico | Detectados desde sus entidades My Honda+ |
| HR-V, CR-V, ZR-V, Jazz, Honda e y e:Ny1 | Ilustración genérica   | Detectados desde sus entidades My Honda+ |
| Otros Honda compatibles                 | Ilustración genérica   | Detectados desde sus entidades My Honda+ |

El modelo solo determina la ilustración. La batería, carga, climatización, cierre y demás bloques se muestran únicamente cuando la integración crea la entidad correspondiente para el dispositivo. Una entidad temporalmente no disponible se indica como **Sin datos**; una capacidad inexistente se oculta.

## Instalación rápida

### 1. Instala la integración de datos

Instala y configura [My Honda+ for Home Assistant](https://github.com/enricobattocchi/myhondaplus-homeassistant). Comprueba en **Ajustes → Dispositivos y servicios** que Home Assistant muestra el vehículo y sus entidades.

### 2. Añade el repositorio a HACS

1. Abre **HACS** y entra en **Frontend**.
2. Pulsa el menú de los tres puntos de la esquina superior derecha.
3. Selecciona **Repositorios personalizados**.
4. En **Repositorio**, pega:

   ```text
   https://github.com/Danieldiazi/myhondaplus-vehicle-card
   ```

5. En **Tipo**, selecciona **Panel de control**. En algunas versiones o traducciones de HACS puede aparecer como **Dashboard**.
6. Pulsa **Añadir**.

Añadir el repositorio personalizado solo hace que HACS lo reconozca. **La tarjeta todavía no está instalada en este punto.**

### 3. Descarga e instala la tarjeta desde HACS

1. Vuelve a **HACS → Frontend**.
2. Busca **My Honda+ Vehicle Card** o abre el repositorio que acabas de añadir.
3. Pulsa **Descargar**.
4. Confirma la versión propuesta y vuelve a pulsar **Descargar** en la ventana de confirmación.
5. Espera a que HACS indique que la instalación ha finalizado.

HACS debe crear automáticamente el recurso JavaScript de la tarjeta. Puedes comprobarlo en **Ajustes → Paneles → Recursos**. La URL esperada es:

```text
/hacsfiles/myhondaplus-vehicle-card/myhondaplus-vehicle-card.js
```

El tipo del recurso debe ser **Módulo JavaScript**.

### 4. Recarga Home Assistant

Después de instalar o actualizar la tarjeta, realiza una recarga completa del navegador:

- Windows/Linux: `Ctrl + F5` o `Ctrl + Mayús + R`.
- macOS: `Cmd + Mayús + R`.
- Aplicación móvil: cierra completamente la aplicación y vuelve a abrirla.

No suele ser necesario reiniciar todo Home Assistant.

### 5. Añade la tarjeta al panel

1. Abre el panel donde quieras mostrar el coche.
2. Pulsa **Editar panel → Añadir tarjeta**.
3. Busca y selecciona **My Honda+ Vehicle Card**.
4. En el editor visual, selecciona el vehículo y configura el nombre, el color y los controles visibles.
5. Guarda la tarjeta y el panel.

También puedes añadirla manualmente mediante YAML:

```yaml
type: custom:myhondaplus-vehicle-card
device: ID_DEL_DISPOSITIVO
```

La mayor parte de la configuración se puede realizar desde el editor visual, por lo que normalmente no necesitas buscar ni copiar el identificador del dispositivo.

## Responsabilidad de cada proyecto

| Proyecto                     | Responsabilidad                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| My Honda+ for Home Assistant | Autenticación, comunicación con los servicios de Honda y creación de dispositivos, entidades y servicios en Home Assistant. |
| My Honda+ Vehicle Card       | Presentación visual, detección de entidades y ejecución de servicios ya disponibles en Home Assistant.                      |

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
