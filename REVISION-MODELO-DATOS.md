# Revisión del modelo de datos — Backend Mujer Marinilla

Observaciones al modelo entregado por el equipo de practicantes
(diagrama ER + script DDL, entrega del 2026-08-27).
Referencia: `BACKEND-BRIEF.md` y las interfaces actuales en `src/data/`.

---

## Veredicto

El modelo cubre las 7 entidades pedidas en el brief y está bien razonado.
Hay **4 correcciones obligatorias** antes de empezar a programar y
**4 decisiones** que no les corresponde tomar solos: hay que confirmarlas
con la Alcaldía o con el equipo de frontend.

---

## 1. Lo que está bien

- **Privacidad respetada:** ninguna tabla almacena datos de usuarias. Es el
  punto más importante del encargo y está resuelto. Debe seguir así.
- `phones` y `workingDates` normalizados en tablas aparte en lugar de una
  columna JSON, con la justificación escrita: permite CRUD por número.
- `admin_users` con `hashed_password` y sin endpoint público de registro.
- Uso de tipos `time` y `date` reales en vez de strings, como en el frontend.
- Cada tabla lleva un comentario explicando la decisión de diseño. Muy buena
  práctica; mantenerla.

---

## 2. Cambios obligatorios

### 2.1 `category` no puede ser un `ENUM` de SQL

El brief lo pide de forma explícita (§5.1): la taxonomía actual es brasileña
(CEAM, NEAM…) y debe reemplazarse por la colombiana (Comisaría de Familia,
Casa de Justicia, Centro de Salud…). Con un `ENUM`, cada cambio exige una
migración; con una tabla catálogo la Alcaldía lo edita desde la API.

- Crear `equipment_categories (id, slug, label, orden)` y usar `category_id` como FK.
- Revisar los nombres: hoy `equipment_types` es la taxonomía **fina** y
  `category` la **gruesa**, lo que se lee al revés.
  Sugerencia: `equipment_categories` (gruesa, = `FilterTag`) y
  `unit_types` (fina, = `DetailedFilterTag`).

### 2.2 El SQL mezcla dialectos y no corre en ningún motor

`AUTO_INCREMENT` y `ALTER TABLE … COMMENT =` son de MySQL; `timestamptz` es de
PostgreSQL. Sirve como diagrama, no como esquema ejecutable.

El entregable real no es DDL escrito a mano, sino los **modelos SQLAlchemy en
`app/models/` más la primera migración de Alembic** (PostgreSQL en producción,
SQLite en local, según el brief §3).

### 2.3 Faltan las cláusulas `ON DELETE` en todas las llaves foráneas

Al borrar un equipamiento quedan huérfanos en `equipment_phones`,
`equipment_working_dates` y `equipment_violence_types`, y el DELETE falla.

- `ON DELETE CASCADE` en esas tres tablas hijas.
- `ON DELETE RESTRICT` (o `SET NULL`) en `equipments.equipment_type_id` y en
  `referrals.violence_type_id`.
- Falta además el índice único en `(equipment_id, phone_number)`; sí lo
  pusieron en `(equipment_id, work_date)`. Aplicar el mismo criterio.

### 2.4 `Equipment.violenceTypes` hoy no es una relación

En el frontend es un **string libre**
(`"violências física; psicológica, moral…"`), no una lista de identificadores.
Modelarlo como N:M contra el glosario educativo es mejor diseño, pero **cambia
el contrato con el frontend y rompe el seed**, porque habría que parsear texto
libre.

Hay que elegir y dejarlo escrito:

- **Opción A:** mantener `violence_types: str?` — migración transparente, sin
  cambios en el frontend.
- **Opción B:** hacer el N:M — mejor modelo, exige avisar al equipo de Next.js
  y definir cómo se convierten los datos actuales.

---

## 3. Revisar los datos reales antes del seed

Van a chocar con esto en el Sprint 2:

- `phones` usa el número como id (`id: 190`, `id: 192`).
- `violenceTypes` empieza en `id: 0`.
- Con `AUTO_INCREMENT`/`serial` hay que insertar ids explícitos en el seed y
  luego ajustar la secuencia (`setval` en PostgreSQL), o aceptar que los ids
  cambian y comunicarlo al frontend.

---

## 4. Decisiones a confirmar (no las tomen solos)

| Tema | Pregunta |
|---|---|
| `referrals` | ¿Un mismo referral puede aplicar a **varios** tipos de violencia? En los datos actuales hay uno llamado *"Violencia Moral y Psicológica"* con un único `idTipoViolencia`. Si aplica a varios, la FK obligatoria 1:N no alcanza. |
| `equipment_working_dates` | ¿Son fechas en que la unidad **sí** abre (excepción al horario) o en que **cierra**? Definirlo antes de programar el cálculo de "abierto ahora" junto con `holidays`. |
| `referrals.text` | ¿Texto plano, Markdown o HTML? Si es HTML, hay que sanitizarlo al guardarlo, porque viene del panel de administración. |
| Categorías | ¿La API devuelve el slug (`salud`) o la etiqueta que ve la usuaria (`"Unidad de Salud"`, `"Servicios especializados para la Mujer"`, `"Estación de Policía"`)? Por eso el catálogo necesita `slug` **y** `label`. |

---

## 5. Detalles menores

- `created_at` / `updated_at` están solo en `equipments`: ponerlos en todas las
  tablas o en ninguna. Para la Alcaldía sería útil además un `updated_by`.
- Considerar `is_active` en `equipments` en lugar de borrado físico: una unidad
  que cierra temporalmente no debería perder sus datos.
- El índice compuesto en `(latitude, longitude)` casi no ayuda a las consultas
  por *bbox*. Con unas decenas de unidades en Marinilla no hace falta ningún
  índice; si más adelante hiciera falta, la solución es PostGIS. No optimizar
  todavía.
- `open_24h` pasó de `0|1` (frontend) a `boolean`: está bien, pero anotarlo en
  la tabla de equivalencias.

---

## 6. Próximo entregable

1. **Tabla de equivalencias** TS ↔ columna de BD ↔ campo de la API, con los
   alias camelCase de Pydantic. Es lo que evita sorpresas en la integración.
2. **Sprint 1 del brief:** FastAPI corriendo, `GET /health`, Alembic
   configurado y el **CRUD completo de `Phone`** de punta a punta con tests.
   Con eso validamos el patrón antes de replicarlo en las 6 entidades
   restantes.
