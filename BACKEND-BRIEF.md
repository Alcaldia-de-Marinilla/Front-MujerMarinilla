# Brief técnico — Backend (Mujer Marinilla)

Documento de encargo para el equipo de practicantes de desarrollo.
Última actualización: 2026-08-13.

---

## 1. Contexto

La aplicación es una plataforma web para **mujeres víctimas de violencia** en el
municipio de **Marinilla, Antioquia**, adaptada desde el programa *"Mulher Tem
Saída"* de Río de Janeiro. Permite encontrar servicios de atención
geolocalizados y consultar líneas de ayuda.

Hoy el frontend (Next.js) es **100% estático**: todos los datos están
*hardcodeados* en archivos TypeScript dentro de `src/data/`. Para cambiar un
teléfono o agregar una unidad hay que **editar código y volver a desplegar**.

**El objetivo del backend es**: exponer esos datos por una API para que:
1. La Alcaldía pueda actualizarlos sin depender de un desarrollador.
2. El frontend los consuma en tiempo de ejecución en vez de tenerlos incrustados.

---

## 2. ⚠️ Restricción de privacidad (NO negociable)

La app promete a las usuarias que **"las respuestas son anónimas"**. Por lo tanto:

- **PROHIBIDO** almacenar cualquier dato personal o identificable de las
  víctimas: nada del formulario de onboarding asociado a una persona, ni IP,
  ni geolocalización individual, ni identificadores de dispositivo.
- El formulario de onboarding **no envía nada al backend** — solo enruta en el
  cliente. **No lo cambien.**
- Si en el futuro se piden métricas, deben ser **agregadas y anónimas**
  (contadores globales), nunca registros individuales. *(Fuera de alcance en
  esta primera etapa.)*

Esto es seguridad de las usuarias, no una preferencia técnica.

---

## 3. Stack recomendado

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **FastAPI** | Moderno, async, valida con Pydantic, genera docs OpenAPI/Swagger solas. |
| Servidor ASGI | **Uvicorn** | Estándar para FastAPI. |
| Validación / esquemas | **Pydantic v2** | Viene con FastAPI. |
| ORM | **SQLAlchemy 2.0** | Estándar de la industria en Python. |
| Migraciones | **Alembic** | Versiona el esquema de la BD. |
| Base de datos | **PostgreSQL** (prod) / **SQLite** (local) | PostgreSQL soporta datos geográficos; SQLite es cero-configuración para desarrollar. |
| Auth | **OAuth2 Password + JWT** (`python-jose`, `passlib[bcrypt]`) | Login de administradores; lo trae FastAPI en su documentación oficial. |
| Tests | **pytest** + **httpx** | Pruebas de endpoints. |
| Gestión de deps | **uv** o **Poetry** | Reproducible. `requirements.txt` también sirve. |

Documentación base que deben leer: la guía oficial de FastAPI, sección
*"SQL (Relational) Databases"* y *"Security → OAuth2 with Password (and hashing),
Bearer with JWT tokens"*.

---

## 4. Estructura de proyecto sugerida

Crear una carpeta hermana al frontend (repositorio o carpeta aparte, p. ej.
`mulher-rio-backend/`):

```
app/
  main.py                # crea la app FastAPI, monta routers, CORS
  core/
    config.py            # settings (env vars: DATABASE_URL, JWT_SECRET, CORS_ORIGINS)
    security.py          # hashing de contraseñas, creación/verificación de JWT
  db/
    session.py           # engine + SessionLocal + get_db()
    base.py              # Base declarativa
  models/                # modelos SQLAlchemy (tablas)
    equipment.py
    phone.py
    violence_type.py
    equipment_type.py
    referral.py          # encaminhamento
    holiday.py
    admin_user.py
  schemas/               # modelos Pydantic (request/response) por entidad
  crud/                  # funciones get/list/create/update/delete por entidad
  routers/               # un router por entidad + auth.py
    auth.py
    equipments.py
    phones.py
    ...
  deps.py                # dependencias: get_current_admin, etc.
  seed.py                # carga inicial desde los datos actuales
alembic/                 # migraciones
tests/
pyproject.toml
Dockerfile
.env.example
```

---

## 5. Modelos de datos

Deben **reflejar exactamente** las interfaces TypeScript actuales del frontend
para que la migración sea transparente. Fuentes de verdad en el repo del
frontend (`src/data/`):

### 5.1 Equipment (unidad/servicio) — `src/data/equipments.ts`

Campos (mapear tal cual, los `?` son opcionales/nullable):

```
id: int (PK)
equipment_type: enum        # FilterTag: "Unidad de Salud" | "Servicios especializados para la Mujer" | "Estación de Policía"
type: enum?                  # DetailedFilterTag (taxonomía fina)
name: str
abbreviation: str?
opening_time: str?           # "08:00:00"
closing_time: str?
phones: list[str]?           # array de números
description: str?
function: str?
violence_types: str?
address: str?
neighborhood: str?
notes: str?
latitude: float?
longitude: float?
opening_time_saturday: str?
closing_time_saturday: str?
opening_time_sunday: str?
closing_time_sunday: str?
working_dates: list[str]?
open_24: int                 # 0 | 1
```

> Nota: `phones` y `working_dates` son arreglos. En PostgreSQL usar columnas
> `ARRAY`/`JSONB`; en SQLite, `JSON`. La API debe devolverlos como listas JSON.

> **Ojo con las llaves:** el frontend hoy usa los `enum` de tipo con valores en
> texto (`FilterTag`, `DetailedFilterTag`) y la taxonomía es brasileña
> (CEAM, NEAM…). Está pendiente adaptarla a la realidad colombiana (Comisaría
> de Familia, Casa de Justicia, etc.). Modelar `equipment_type`/`type` como
> tablas de catálogo o como enums configurables, no *hardcodeados*, para que
> ese cambio no requiera tocar código.

### 5.2 Phone (línea telefónica) — `src/data/phones.ts`

```
id: int (PK)
number: str                  # "123"
title: str
description: str
```

### 5.3 ViolenceType — `src/data/violenceTypes.ts`

```
id: int (PK)
name: str
description: str
examples: list[str]?
image: str?                  # nombre de archivo SVG
```

### 5.4 EquipmentType (catálogo) — `src/data/equipmentsTypes.ts`

```
id: int (PK)
abbreviation: str
name: str
description: str
```

### 5.5 Referral / Encaminhamento — `src/data/encaminhamento.ts`

```
id: int (PK)
header: str
text: str                    # en el frontend es ReactNode; en la API texto/HTML plano
image: str?
name: str?
id_tipo_violencia: int       # FK lógica a ViolenceType
```

### 5.6 Holiday (festivo) — `src/utils/holidays.ts`

Pendiente reemplazar festivos de Brasil por los de Colombia + municipales de
Marinilla. Modelar como:

```
id: int (PK)
date: date                   # "2026-01-01"
name: str
```

### 5.7 AdminUser (interno, no expuesto en lecturas)

```
id: int (PK)
email: str (único)
hashed_password: str
is_active: bool
created_at: datetime
```

---

## 6. Endpoints

**Regla general:** lectura pública (GET), escritura protegida por login de
admin (POST/PUT/PATCH/DELETE).

Por cada entidad (equipments, phones, violence-types, equipment-types,
referrals, holidays):

```
GET    /api/v1/{recurso}         # lista (público) — soportar filtros donde aplique
GET    /api/v1/{recurso}/{id}    # detalle (público)
POST   /api/v1/{recurso}         # crear (admin)
PUT    /api/v1/{recurso}/{id}    # reemplazar (admin)
PATCH  /api/v1/{recurso}/{id}    # actualizar parcial (admin)
DELETE /api/v1/{recurso}/{id}    # eliminar (admin)
```

Filtros útiles en `GET /api/v1/equipments`:
- `?equipment_type=...` (por FilterTag)
- `?type=...` (por DetailedFilterTag)
- opcional: `?bbox=minLng,minLat,maxLng,maxLat` para el mapa.

Autenticación:

```
POST /api/v1/auth/login          # OAuth2 password → devuelve access_token (JWT)
GET  /api/v1/auth/me             # datos del admin autenticado
```

Extras:
- `GET /health` → `{"status": "ok"}` para healthchecks (k8s/Cloud Run).
- `GET /docs` (Swagger) y `GET /redoc` los genera FastAPI automáticamente.

---

## 7. Autenticación de administradores

- Flujo **OAuth2 password + JWT Bearer** (patrón oficial de FastAPI).
- Contraseñas hasheadas con **bcrypt** (`passlib`). Nunca en texto plano.
- Dependencia `get_current_admin` que valida el token y protege los endpoints
  de escritura.
- El primer administrador se crea por un comando de *seed/CLI* (no por un
  endpoint público de registro).
- `JWT_SECRET`, expiración del token y credenciales iniciales van por **variables
  de entorno**, nunca *commiteadas*.

*(No se construye panel de administración: el equipo de frontend consumirá estos
endpoints. FastAPI ya entrega Swagger en `/docs` para probar mientras tanto.)*

---

## 8. Integración con el frontend

1. **CORS:** permitir el origen del frontend (`CORS_ORIGINS` por env var:
   `http://localhost:3000` en dev y el dominio de producción).
2. **Contrato:** los JSON de respuesta deben tener la **misma forma** que las
   interfaces TS actuales (cuidado camelCase vs snake_case — decidir uno y
   documentarlo; recomendado exponer **camelCase** en la API usando alias de
   Pydantic para que el frontend no cambie los tipos).
3. **Migración del frontend (tarea del equipo Next.js, no de los practicantes):**
   reemplazar los `import { equipments } from '@/data/...'` por llamadas `fetch`
   a la API. Se hace después de que la API esté estable.
4. **Seed inicial:** convertir los arreglos de `src/data/*.ts` a la BD. Se puede
   exportar cada arreglo a JSON y cargarlo con `app/seed.py`.

---

## 9. Despliegue

El frontend ya se despliega en **GCP** (hay `Dockerfile`, `cloudbuild-*.yaml` y
manifiestos `k8s/`). Sugerencia para el backend, alineado con esa infraestructura:

- **Dockerfile** con Uvicorn (`uvicorn app.main:app --host 0.0.0.0 --port 8080`).
- **GCP Cloud Run** o el mismo clúster de Kubernetes.
- **Cloud SQL (PostgreSQL)** como base de datos gestionada.
- Secretos (JWT, credenciales BD) en **Secret Manager**, no en el repo.
- Migraciones Alembic como paso previo al arranque.

---

## 10. Plan sugerido por sprints (para practicantes)

**Sprint 1 — Andamiaje**
- Repo, `pyproject`, FastAPI corriendo, `GET /health`, Swagger visible.
- SQLAlchemy + SQLite local + primera migración Alembic.
- Modelo y CRUD completo de **Phone** (el más simple) de punta a punta + tests.

**Sprint 2 — Maestros de datos**
- Modelos, esquemas y CRUD de **Equipment**, **ViolenceType**, **EquipmentType**,
  **Referral**, **Holiday**.
- `seed.py` cargando los datos actuales del frontend.
- Filtros de `equipments`.

**Sprint 3 — Seguridad e integración**
- Auth de administradores (login JWT, `get_current_admin`, proteger escrituras).
- CORS + respuesta en camelCase alineada al frontend.
- Dockerfile + `.env.example` + README de despliegue.

---

## 11. Criterios de aceptación

- [ ] `GET` públicos de todas las entidades devuelven los datos con la misma
      forma que las interfaces TS actuales.
- [ ] `POST/PUT/PATCH/DELETE` requieren token de admin válido; sin él, `401`.
- [ ] Login emite JWT; contraseñas hasheadas con bcrypt.
- [ ] Swagger (`/docs`) documenta todos los endpoints.
- [ ] `seed.py` reproduce en la BD los datos de `src/data/`.
- [ ] Tests de pytest cubren, como mínimo, el CRUD de una entidad y el flujo de
      auth (login + acceso protegido).
- [ ] **NINGÚN** endpoint recibe ni almacena datos del formulario de onboarding
      ni datos personales de usuarias.
- [ ] Sin secretos en el repositorio; todo por variables de entorno.

---

## 12. Preguntas abiertas para resolver con la Alcaldía / equipo

- Taxonomía definitiva de tipos de unidad en Marinilla (reemplaza la brasileña).
- Si habrá más de un administrador y si necesitan roles distintos.
- Dominio de producción del frontend (para CORS).
- ¿La ruta de atención (`referrals`) puede contener HTML/enlaces? Definir formato.
