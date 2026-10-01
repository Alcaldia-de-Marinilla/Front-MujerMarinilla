# Integración con el backend (mujer-marinilla-backend)

Este documento resume la Parte 2 de la revisión técnica del 16 de
septiembre de 2026 ("Guía para conectar el backend con el frontend") y
qué de eso quedó implementado en este frontend.

## Arquitectura

El navegador de la usuaria **nunca llama a la API**. Next.js consulta el
backend desde sus Server Components (en el servidor) y entrega la
página ya armada:

```
Navegador de la usuaria -> Servidor Next.js -> API FastAPI -> Base de datos
                                  (fetch con caché de 5 min)
```

Esto refuerza la privacidad (la IP de la usuaria nunca llega al
backend), evita configurar CORS, y mantiene la app funcionando con los
datos estáticos de respaldo si la API se cae — obligatorio en una
herramienta para víctimas de violencia.

## Cómo correr los dos proyectos en local

**Terminal 1 — backend** (con el entorno virtual ya creado y `.env` configurado):
```bash
cd backend
venv\Scripts\activate          # Windows; source venv/bin/activate en Linux/Mac
uvicorn app.main:app --reload --port 8000
```
Confirma que `http://127.0.0.1:8000/health` responde `{"status":"ok"}`.

**Terminal 2 — frontend:**
```bash
cd mulher-rio-landing-page-master
cp .env.example .env.local     # si no existe aún
# Completa MAPBOX_ACCESS_TOKEN, GOOGLE_ANALYTICS_ID, etc. con tus valores
npm install
npm run dev
```

`.env.local` debe tener `API_URL="http://127.0.0.1:8000"` (ya viene en
`.env.example`). Es una variable **de servidor**, sin el prefijo
`NEXT_PUBLIC_`: así nunca llega al navegador.

## Qué quedó conectado a la API (con respaldo estático automático)

| Pantalla | Dato | Función |
|---|---|---|
| `/telefones` | Teléfonos de ayuda | `getPhones()` |
| Botón "Emergencia" (home, `/infos`, formularios de onboarding) | Teléfonos por código estable | `getPhones()` + `setSelectedPhoneCodes()` |
| `/infos` | Tipos de unidad + tipos de violencia | `getEquipmentTypes()` + `getViolenceTypes()` |
| `/tipos-de-violencia` | Tipos de violencia | `getViolenceTypes()` |
| `/tipos-de-unidades` | Tipos de unidad | `getEquipmentTypes()` |
| `/equipamentos` (lista y mapa) | Unidades de atención | `getEquipments()` |
| `/equipamentos/[id]` | Detalle de una unidad | `getEquipment(id)` |

Todas estas funciones viven en `src/http/api/queries.ts`. Si la API no
responde (apagada, con error, etc.), cada una registra
`console.error('[api] ...')` en la terminal del servidor de Next.js y
devuelve los datos estáticos de `src/data/*.ts`, así que la app **nunca
se queda en blanco**.

## El problema de los ids fijos (D1) y cómo se resolvió aquí

Antes, el botón de emergencia llamaba `setSelectedPhoneIds([190, 192])`:
buscaba teléfonos por su `id` original de `phones.ts`. La API asigna
`id` autoincrement (1, 2, 3...), así que esa búsqueda dejaría de
encontrar resultados.

Solución aplicada: el backend expone un `code` estable para teléfonos
(punto D1 de la revisión, ej. `"policia"`, `"emergencias-medicas"`), y
el frontend ahora busca por ese código:
`setSelectedPhoneCodes(['policia', 'emergencias-medicas'])`
(ver `src/context/PhoneContext.tsx`). Los datos estáticos de respaldo
(`src/data/phones.ts`) ya traen el mismo `code` a mano, así que el botón
funciona igual con o sin backend.

## Lo que quedó pendiente (a propósito, no por descuido)

- **Rutas de atención (`referrals` / `encaminhamentoTexts`)**: el flujo
  de onboarding (`/onboarding/formulario`, `/onboarding/emergencia`,
  `/onboarding/encaminhamento`) sigue usando el archivo estático
  `src/data/encaminhamento.ts`, **no** la API. Conectarlo requiere
  rediseñar cómo `FormContext` guarda y pasa el "id" seleccionado entre
  pantallas (hoy son números fijos 1-6 y 201-206 pensados para un
  arreglo local), y el editor de esta sesión prefirió no tocar ese flujo
  crítico sin poder probarlo con el equipo. Es el siguiente paso lógico
  de esta integración.
- **Festivos (`holidays` / `isHoliday`)**: `src/utils/holidays.ts` sigue
  con la lista fija de Río de Janeiro. El backend ya tiene el endpoint
  `/api/v1/holidays` con los festivos de Colombia 2026 cargados por el
  seed; falta cablear `isHoliday()` para recibir la lista por parámetro
  en vez de tenerla hardcodeada.
- Se agregó `API_URL` a `cloudbuild-staging.yaml` y `cloudbuild-prod.yaml`
  (sustitución `_API_URL`); falta que alguien con acceso a Cloud Build
  configure el valor real de esa variable de sustitución en cada trigger.

## Verificación hecha en esta sesión

- `npx tsc --noEmit` — sin errores.
- `npm run build` — compila todo el código correctamente (Next.js
  detectó y corrigió sobre la marcha un bug preexistente: `HeaderWithReturn`
  usaba `useRouter` sin `'use client'`, algo que quedaba oculto porque
  antes todas las páginas que lo usaban ya eran Client Components). El
  build solo se interrumpe en este entorno de pruebas por no tener
  salida a internet hacia Google Fonts — no es un error del código, y no
  debería ocurrir en tu máquina ni en Cloud Build.
