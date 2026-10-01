# Adaptación a Marinilla, Antioquia

Documento de avance del proyecto. Esta plataforma se está adaptando desde la
versión original de Río de Janeiro (programa "Mulher Tem Saída" de la SPM Rio)
hacia el municipio de **Marinilla, Antioquia, Colombia**: una landing para que
mujeres víctimas de violencia encuentren servicios de atención geolocalizados.

Última actualización: 2026-05-21

---

## Estado general

| Fase | Estado |
|---|---|
| Levantar la app en local | ✅ Hecho |
| Traducción PT → ES (Colombia) | ✅ Hecho |
| Geo-config (mapa centrado en Marinilla) | ✅ Hecho |
| Inventario de datos (unidades, teléfonos) | ⏳ Pendiente — datos los aporta el cliente |
| Branding (logos, nombre del programa) | ⏳ Pendiente — assets los aporta el cliente |
| Festivos colombianos | ⏳ Pendiente |

Decisiones tomadas:
- **Solo español**, sin sistema i18n (los textos se reemplazaron en su lugar).
- **No se necesita base de datos**: los datos viven en arreglos TypeScript en `src/data/`.

---

## Cómo correr la app

```bash
npm install
npm run dev
```

Abre http://localhost:3000

Requiere el archivo `.env.local` (ya creado, ignorado por git) con:

```
MAPBOX_ACCESS_TOKEN=pk....   # obligatorio, sin esto el mapa no carga
GOOGLE_TAG_MANAGER_ID=
GOOGLE_ANALYTICS_ID=
GOOGLE_MAPS_API_KEY=
HOTJAR_ID=
```

Las variables de analítica pueden ir vacías para desarrollo local.

---

## Lo completado

### Traducción PT → ES
Todo el texto visible al usuario está en español de Colombia:
- Páginas: inicio, emergencia, infos, teléfonos, tipos-de-unidades,
  tipos-de-violencia.
- Flujo de onboarding completo (formulario, emergencia, encaminhamento).
- Componentes: headers, footer, navegación, tarjetas, indicador de estado,
  y todo el módulo del mapa (`equipment-tabs`).
- Copia de los archivos de datos: `violenceTypes.ts`, `phones.ts`,
  `equipmentsTypes.ts`, `encaminhamento.ts`.
- `<html lang="es-CO">` y metadata (title/description).

### Geo-config
El mapa ahora centra en Marinilla:
- `src/utils/types.ts` — `RIO_VIEWSTATE` renombrado a `MARINILLA_VIEWSTATE`
  (lng -75.3375, lat 6.1739, zoom 13).
- `INITIAL_VIEW_PORT` en el mapa actualizado.
- `bbox` de búsqueda de direcciones → Oriente Antioqueño
  (`-75.55,6.00,-75.20,6.35`).
- `mapCenter` inicial de `useAddressSearch.ts` → Marinilla.

Verificación: `npx tsc --noEmit` pasa sin errores.

---

## Lo pendiente

Todos los puntos están marcados en el código con comentarios
`TODO (datos Marinilla)` o `TODO (branding Marinilla)`.

- [ ] **Inventario de unidades** — reemplazar el arreglo `equipments` en
  `src/data/equipments.ts` (~5800 líneas, datos de Río) con las unidades
  reales de Marinilla: Comisaría de Familia, Casa de Justicia, hospital,
  centros de salud, estación de policía, etc. Cada una con nombre, dirección,
  horario, teléfonos y **coordenadas GPS**.
- [ ] **Teléfonos** — reemplazar `src/data/phones.ts` con las líneas
  colombianas: 123 (emergencias), 155 (orientación a la mujer), 122
  (Fiscalía), 141 (ICBF) y la línea local de la Comisaría de Familia.
- [ ] **Festivos** — `src/utils/holidays.ts` tiene los festivos de Brasil;
  reemplazar por los festivos de Colombia y los municipales de Marinilla.
- [ ] **Branding** — reemplazar `public/SPM_MULHER_TEM_SAIDA.png` y los logos
  en `src/app/components/header.tsx`; definir el nombre oficial del programa
  (hoy el title dice "Mujer Marinilla" como provisional).
- [ ] **Taxonomía de unidades** — `equipmentsTypes.ts` y los enums
  `FilterTag` / `DetailedFilterTag` en `equipments.ts` usan la clasificación
  brasileña (CEAM, NEAM, DEAM…); ajustar a la realidad colombiana.
- [ ] **Ruta de atención** — validar con la Alcaldía los textos de
  `encaminhamento.ts` frente a la Ley 1257 de 2008.

---

## Gotchas importantes

- **Marcadores fuera de pantalla:** el mapa ya centra en Marinilla, pero
  como `equipments.ts` aún tiene coordenadas de Río, los marcadores no se
  ven hasta reemplazar los datos. No es un bug.
- **Enum `FilterTag`:** sus valores se muestran en la UI como etiquetas de
  filtro. El código del mapa (`map/index.tsx`) ahora compara contra el enum
  (`FilterTag.WOMAN`) y no contra strings literales. Si se cambian los
  valores del enum, revisar que no haya comparaciones con strings sueltos.
- **Formato de teléfono:** `EquipmentDetails.tsx` (`maskPhoneNumber`) asume
  el código de área de Río ("21"); ajustar al formato colombiano.

---

## Anexo: correo para solicitar los maestros de datos

Borrador para enviar a la Alcaldía de Marinilla (Secretaría de la Mujer /
Secretaría de Gobierno / Comisaría de Familia).

> **Asunto:** Solicitud de información — plataforma de orientación a mujeres
> víctimas de violencia en Marinilla
>
> Respetados señores,
>
> Reciban un cordial saludo. Estamos desarrollando una plataforma web
> gratuita para el municipio de Marinilla, orientada a mujeres víctimas de
> violencia, que les permita identificar de forma rápida y geolocalizada los
> servicios de atención disponibles. Para cargar información veraz y
> actualizada requerimos su colaboración con los siguientes maestros de datos:
>
> **1. Inventario de unidades y servicios** (Excel/CSV). Por cada unidad:
> nombre oficial, tipo (Comisaría / Casa de Justicia / Hospital / Centro de
> Salud / Estación de Policía / Fiscalía / ICBF), dirección completa,
> coordenadas GPS, horario de atención, teléfonos, servicios que presta y
> población objetivo.
>
> **2. Líneas telefónicas** de emergencia y orientación, nacionales y
> locales (confirmar 123, 155, 122, 141 y la línea de la Comisaría de
> Familia de Marinilla).
>
> **3. Ruta de atención oficial** según el tipo de violencia (física,
> psicológica, sexual, económica), bajo la Ley 1257 de 2008.
>
> **4. Tipos de violencia** — clasificación o glosario propio si lo hay.
>
> **5. Identidad institucional** — logo oficial en vectorial (SVG/PNG),
> nombre del programa, paleta de colores institucional.
>
> **6. Persona de contacto** designada para validar el contenido y
> disponibilidad para una reunión virtual de 30 minutos.
>
> La plataforma será entregada al municipio sin costo. Quedamos atentos.
>
> Cordialmente,
> [Nombre / cargo / contacto]
