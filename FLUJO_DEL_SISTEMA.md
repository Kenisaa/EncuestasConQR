# Flujo del Sistema - EncuestasQR

Este documento explica el flujo completo del sistema de encuestas con códigos QR, desde el registro de usuarios hasta la visualización de resultados.

---

## Tabla de Contenidos

1. [Diagrama General del Flujo](#diagrama-general-del-flujo)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Flujo de Creación de Encuestas](#flujo-de-creación-de-encuestas)
4. [Flujo de Respuesta a Encuestas](#flujo-de-respuesta-a-encuestas)
5. [Flujo de Visualización de Resultados](#flujo-de-visualización-de-resultados)
6. [Base de Datos y Políticas RLS](#base-de-datos-y-políticas-rls)
7. [Rutas y Navegación](#rutas-y-navegación)

---

## Diagrama General del Flujo

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PÁGINA DE INICIO (/)                          │
│  - Presentación del sistema                                          │
│  - Opciones: Iniciar Sesión / Registrarse                           │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
         ▼                            ▼
┌──────────────────┐        ┌──────────────────┐
│  REGISTRO        │        │  INICIO SESIÓN   │
│  /registro       │        │  /login          │
└────────┬─────────┘        └────────┬─────────┘
         │                           │
         └──────────┬────────────────┘
                    │
                    ▼
         ┌────────────────────┐
         │   DASHBOARD        │
         │   /dashboard       │
         │                    │
         │  - Lista encuestas │
         │  - Nueva encuesta  │
         │  - Ver detalles    │
         │  - Ver resultados  │
         └──────────┬─────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
         ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌──────────┐
    │ CREAR  │ │DETALLES│ │RESULTADOS│
    │ENCUESTA│ │   +    │ │   +      │
    │        │ │  QR    │ │ GRÁFICOS │
    └────────┘ └────────┘ └──────────┘
                    │
                    │ (Compartir QR)
                    ▼
         ┌─────────────────────┐
         │  ENCUESTA PÚBLICA   │
         │  /encuesta/[id]     │
         │                     │
         │  - Formulario       │
         │  - Responder        │
         │  - Anónimo/Público  │
         └─────────────────────┘
```

---

## Flujo de Autenticación

### 1. Registro de Usuario (`/registro`)

**Archivo:** `app/registro/page.tsx`

**Proceso:**
1. Usuario accede a `/registro`
2. Completa el formulario:
   - Nombre
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Repetir contraseña
3. Validaciones client-side:
   - Contraseñas coinciden
   - Longitud mínima de contraseña
4. Se envía petición a Supabase Auth:
   ```typescript
   supabase.auth.signUp({
     email,
     password,
     options: {
       emailRedirectTo: '/dashboard',
       data: { nombre }
     }
   })
   ```
5. Trigger automático crea entrada en `profiles` (via SQL trigger)
6. Redirección a `/registro/exito`

**Base de Datos:**
- Tabla: `auth.users` (Supabase Auth)
- Tabla: `public.profiles` (perfil extendido)

---

### 2. Inicio de Sesión (`/login`)

**Archivo:** `app/login/page.tsx`

**Proceso:**
1. Usuario accede a `/login`
2. Ingresa credenciales:
   - Email
   - Contraseña
3. Autenticación con Supabase:
   ```typescript
   supabase.auth.signInWithPassword({ email, password })
   ```
4. Si es exitoso:
   - Se crea sesión (cookie)
   - Redirección a `/dashboard`
5. Si falla:
   - Mensaje de error

**Sesión:**
- Cookie HTTP-only
- Manejada por `@supabase/ssr`
- Válida en server y client components

---

### 3. Cierre de Sesión

**Archivo:** `app/api/auth/logout/route.ts`

**Proceso:**
1. Usuario hace clic en "Salir" desde dashboard
2. POST request a `/api/auth/logout`
3. Se elimina la sesión de Supabase
4. Se limpia la cookie
5. Redirección a `/`

---

## Flujo de Creación de Encuestas

### 1. Dashboard Principal (`/dashboard`)

**Archivo:** `app/dashboard/page.tsx`

**Proceso:**
1. Verificación de autenticación (server-side):
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) redirect("/login");
   ```
2. Carga de encuestas del usuario:
   ```typescript
   supabase
     .from("surveys")
     .select("*")
     .eq("user_id", user.id)
     .order("created_at", { ascending: false })
   ```
3. Renderizado de lista de encuestas
4. Opción "Nueva Encuesta"

**Componente:** `SurveyList`

---

### 2. Crear Nueva Encuesta (`/dashboard/encuestas/nueva`)

**Archivo:** `app/dashboard/encuestas/nueva/page.tsx`
**Componente:** `NewSurveyForm`

**Proceso:**
1. Verificación de autenticación
2. Usuario completa formulario:
   - **Título** (requerido)
   - **Descripción** (opcional)
   - **Preguntas** (mínimo 1):
     - Texto de la pregunta
     - Tipo de pregunta:
       - `texto` - Respuesta libre
       - `opcion_multiple` - Selección múltiple
       - `calificacion` - Escala 1-5
       - `si_no` - Booleano
     - Opciones (para tipo `opcion_multiple`)
     - Si es requerida

3. Creación de encuesta en base de datos:
   ```typescript
   // 1. Insertar survey
   const { data: survey } = await supabase
     .from("surveys")
     .insert({
       user_id,
       titulo,
       descripcion,
       activa: true
     })
     .select()
     .single();

   // 2. Insertar preguntas
   const questionsData = questions.map((q, index) => ({
     survey_id: survey.id,
     pregunta: q.texto,
     tipo: q.tipo,
     opciones: q.opciones,
     orden: index,
     requerida: q.requerida
   }));

   await supabase.from("questions").insert(questionsData);
   ```

4. Redirección a `/dashboard/encuestas/[id]` (página de detalles)

**Base de Datos:**
- Tabla: `surveys` (encuesta)
- Tabla: `questions` (preguntas)

---

### 3. Ver Detalles de Encuesta (`/dashboard/encuestas/[id]`)

**Archivo:** `app/dashboard/encuestas/[id]/page.tsx`
**Componente:** `QRCodeDisplay`

**Proceso:**
1. Verificación de autenticación
2. Carga de encuesta y preguntas:
   ```typescript
   const { data: survey } = await supabase
     .from("surveys")
     .select("*")
     .eq("id", id)
     .eq("user_id", user.id)  // Solo del dueño
     .single();
   ```
3. Generación de URL pública:
   ```
   https://tu-dominio.com/encuesta/[id]
   ```
4. Generación de código QR (client-side):
   ```typescript
   import { QRCodeSVG } from 'qrcode.react';
   <QRCodeSVG value={surveyUrl} />
   ```
5. Opciones:
   - **Compartir QR** (descargar, copiar URL)
   - **Ver Resultados**
   - **Editar/Eliminar** (si aplica)
   - **Activar/Desactivar** encuesta

**Componentes:**
- `QRCodeDisplay` - Muestra el código QR
- Botones de acción

---

## Flujo de Respuesta a Encuestas

### URL Pública (`/encuesta/[id]`)

**Archivo:** `app/encuesta/[id]/page.tsx`
**Componente:** `SurveyResponseForm`

**Proceso:**

#### 1. Acceso a la Encuesta
- Usuario escanea QR o accede por URL
- **NO requiere autenticación** (público/anónimo)
- Carga de encuesta activa:
  ```typescript
  const { data: survey } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .eq("activa", true)  // Solo activas
    .single();
  ```
- Si no existe o está inactiva → 404

#### 2. Mostrar Formulario
- Título y descripción de la encuesta
- Campos opcionales:
  - Nombre del respondente
  - Email del respondente
- Todas las preguntas en orden

#### 3. Responder Preguntas
Según el tipo de pregunta:
- **Texto libre:** `<textarea>` o `<input type="text">`
- **Opción múltiple:** Radio buttons
- **Calificación:** Botones 1-5 o estrellas
- **Sí/No:** Radio buttons (Sí/No)

#### 4. Enviar Respuestas
```typescript
// 1. Crear respuesta general
const { data: response } = await supabase
  .from("responses")
  .insert({
    survey_id: surveyId,
    respondente_nombre: nombre,
    respondente_email: email
  })
  .select()
  .single();

// 2. Crear respuestas individuales
const answersData = answers.map(a => ({
  response_id: response.id,
  question_id: a.questionId,
  respuesta: a.valor
}));

await supabase.from("answers").insert(answersData);
```

#### 5. Confirmación
- Mensaje de éxito
- Opción de enviar otra respuesta

**Base de Datos:**
- Tabla: `responses` (respuesta general)
- Tabla: `answers` (respuestas individuales por pregunta)

**Políticas RLS:**
- Cualquier usuario (incluso anónimo) puede:
  - Leer encuestas activas
  - Insertar respuestas
  - Insertar answers

---

## Flujo de Visualización de Resultados

### Página de Resultados (`/dashboard/encuestas/[id]/resultados`)

**Archivo:** `app/dashboard/encuestas/[id]/resultados/page.tsx`
**Componente:** `ResultsCharts`

**Proceso:**

#### 1. Verificación
- Usuario autenticado
- Es el dueño de la encuesta:
  ```typescript
  const { data: survey } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)  // Verificar propiedad
    .single();
  ```

#### 2. Carga de Datos
```typescript
// Preguntas
const { data: questions } = await supabase
  .from("questions")
  .select("*")
  .eq("survey_id", id)
  .order("orden");

// Respuestas con answers (join)
const { data: responses } = await supabase
  .from("responses")
  .select(`
    id,
    respondente_nombre,
    respondente_email,
    created_at,
    answers:answers(
      id,
      question_id,
      respuesta
    )
  `)
  .eq("survey_id", id)
  .order("created_at", { ascending: false });
```

#### 3. Visualización

**Gráficos (por tipo de pregunta):**

- **Texto libre:**
  - Lista de todas las respuestas
  - Sin gráfico

- **Opción múltiple:**
  - Gráfico de barras (Recharts)
  - Conteo por opción
  - Porcentajes

- **Calificación:**
  - Gráfico de barras
  - Promedio
  - Distribución 1-5

- **Sí/No:**
  - Gráfico de pastel
  - Porcentajes Sí/No

**Respuestas Individuales:**
- Lista cronológica inversa
- Todas las preguntas y respuestas
- Información del respondente (si proporcionó)
- Timestamp

#### 4. Exportación de Datos

**Componente:** `ExportButton`

**Formato CSV:**
```csv
Respondente,Email,Fecha,Pregunta 1,Pregunta 2,...
Juan Pérez,juan@email.com,2025-12-01 14:30,Respuesta 1,Respuesta 2,...
```

**Proceso:**
```typescript
// Client-side
const csv = generateCSV(survey, questions, responses);
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
// Trigger download
```

---

## Base de Datos y Políticas RLS

### Esquema de Base de Datos

```
auth.users (Supabase Auth)
    ↓ (1:1)
profiles
    - id (FK → auth.users)
    - email
    - nombre
    - created_at

surveys
    - id (UUID)
    - user_id (FK → auth.users)
    - titulo
    - descripcion
    - activa (boolean)
    - created_at
    - updated_at
    ↓ (1:N)
questions
    - id (UUID)
    - survey_id (FK → surveys)
    - pregunta
    - tipo ('texto', 'opcion_multiple', 'calificacion', 'si_no')
    - opciones (JSONB)
    - orden
    - requerida
    - created_at

responses
    - id (UUID)
    - survey_id (FK → surveys)
    - respondente_nombre
    - respondente_email
    - created_at
    ↓ (1:N)
answers
    - id (UUID)
    - response_id (FK → responses)
    - question_id (FK → questions)
    - respuesta (TEXT)
```

### Políticas de Row Level Security (RLS)

#### Tabla: `profiles`
```sql
-- Los usuarios solo ven/editan su propio perfil
SELECT: auth.uid() = id
INSERT: auth.uid() = id
UPDATE: auth.uid() = id
```

#### Tabla: `surveys`
```sql
-- Los usuarios solo ven/editan sus propias encuestas
SELECT (autenticado): auth.uid() = user_id
INSERT: auth.uid() = user_id
UPDATE: auth.uid() = user_id
DELETE: auth.uid() = user_id

-- Las encuestas activas son públicas (para responder)
SELECT (público): activa = true
```

#### Tabla: `questions`
```sql
-- Solo el dueño de la encuesta puede gestionar preguntas
SELECT/INSERT/UPDATE/DELETE:
  EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = questions.survey_id
    AND surveys.user_id = auth.uid()
  )

-- Lectura pública para encuestas activas
SELECT (público):
  EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = questions.survey_id
    AND surveys.activa = true
  )
```

#### Tabla: `responses`
```sql
-- Cualquiera puede insertar respuestas (anónimo)
INSERT: true

-- Solo el dueño de la encuesta puede ver respuestas
SELECT:
  EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = responses.survey_id
    AND surveys.user_id = auth.uid()
  )
```

#### Tabla: `answers`
```sql
-- Cualquiera puede insertar answers (anónimo)
INSERT: true

-- Solo el dueño de la encuesta puede ver answers
SELECT:
  EXISTS (
    SELECT 1 FROM responses
    JOIN surveys ON surveys.id = responses.survey_id
    WHERE responses.id = answers.response_id
    AND surveys.user_id = auth.uid()
  )
```

---

## Rutas y Navegación

### Rutas Públicas (No autenticadas)

| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/` | Página de inicio | `app/page.tsx` |
| `/login` | Inicio de sesión | `app/login/page.tsx` |
| `/registro` | Registro de usuario | `app/registro/page.tsx` |
| `/registro/exito` | Confirmación de registro | `app/registro/exito/page.tsx` |
| `/encuesta/[id]` | Formulario público de encuesta | `app/encuesta/[id]/page.tsx` |

### Rutas Protegidas (Requieren autenticación)

| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/dashboard` | Panel principal | `app/dashboard/page.tsx` |
| `/dashboard/encuestas/nueva` | Crear encuesta | `app/dashboard/encuestas/nueva/page.tsx` |
| `/dashboard/encuestas/[id]` | Detalles + QR | `app/dashboard/encuestas/[id]/page.tsx` |
| `/dashboard/encuestas/[id]/resultados` | Resultados + gráficos | `app/dashboard/encuestas/[id]/resultados/page.tsx` |

### API Routes

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/auth/logout` | POST | Cerrar sesión |

---

## Middlewares y Protección

### Server-Side Protection

Todas las rutas protegidas verifican autenticación:

```typescript
const supabase = await createClient(); // Server client
const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  redirect("/login");
}
```

### Client-Side State

- Componentes client usan `createClient()` de `@/lib/supabase/client`
- Componentes server usan `createClient()` de `@/lib/supabase/server`
- Session manejada por cookies HTTP-only

---

## Flujo de Datos Completo (Ejemplo)

### Escenario: Usuario crea encuesta y recibe respuestas

```
1. AUTENTICACIÓN
   Usuario → /registro → Supabase Auth → profiles table → /dashboard

2. CREACIÓN
   Dashboard → /encuestas/nueva → Formulario →
   INSERT surveys + INSERT questions → /encuestas/[id]

3. COMPARTIR
   /encuestas/[id] → Generar QR → URL: /encuesta/[id] → Compartir

4. RESPUESTAS (Anónimas)
   Respondente → Escanea QR → /encuesta/[id] →
   Formulario → INSERT responses + INSERT answers → Confirmación

5. VISUALIZACIÓN
   Dashboard → /encuestas/[id]/resultados →
   SELECT responses + answers → Gráficos (Recharts) → Exportar CSV
```

---

## Características de Seguridad

### 1. Row Level Security (RLS)
- Todas las tablas tienen RLS habilitado
- Políticas estrictas por usuario
- Acceso público solo a lo necesario

### 2. Autenticación
- Supabase Auth (seguro y confiable)
- Sesiones HTTP-only cookies
- Verificación server-side

### 3. Validaciones
- Client-side (UX)
- Server-side (seguridad)
- Constraints en base de datos

### 4. CORS y Headers
- Next.js maneja headers automáticamente
- Supabase gestiona CORS

---

## Tecnologías por Capa

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** React 18 + Tailwind CSS
- **Componentes:** shadcn/ui + Radix UI
- **Formularios:** React Hook Form + Zod
- **Gráficos:** Recharts
- **QR:** qrcode.react

### Backend
- **BaaS:** Supabase (PostgreSQL + Auth)
- **API:** Next.js API Routes
- **ORM:** Supabase Client (JavaScript)

### Deployment
- **Hosting:** Render
- **CI/CD:** GitHub Actions
- **Analytics:** Vercel Analytics

---

## Diagramas de Secuencia

### Crear y Responder Encuesta

```
Usuario        App           Supabase DB       Respondente
  |             |                 |                 |
  |--Registro-->|                 |                 |
  |             |--signUp()------>|                 |
  |             |<--User ID-------|                 |
  |             |                 |                 |
  |--Login----->|                 |                 |
  |             |--signIn()------>|                 |
  |             |<--Session-------|                 |
  |             |                 |                 |
  |--Nueva      |                 |                 |
  |  Encuesta-->|                 |                 |
  |             |--INSERT survey->|                 |
  |             |--INSERT qs----->|                 |
  |             |<--Survey ID-----|                 |
  |             |                 |                 |
  |<--QR Code---|                 |                 |
  |             |                 |                 |
  |--Compartir--|---------------->|---------------->|
  |   QR        |                 |                 |
  |             |                 |                 |
  |             |                 |    <--Escanea QR|
  |             |                 |                 |
  |             |    <--GET /encuesta/[id]----------|
  |             |                 |                 |
  |             |--SELECT survey->|                 |
  |             |<--Survey data---|                 |
  |             |                 |                 |
  |             |---Formulario---------------->    |
  |             |                 |                 |
  |             |    <--POST respuestas-------------|
  |             |                 |                 |
  |             |--INSERT response|                 |
  |             |--INSERT answers>|                 |
  |             |<--Success-------|                 |
  |             |                 |                 |
  |             |---Confirmación---------------->  |
  |             |                 |                 |
  |--Ver        |                 |                 |
  | Resultados->|                 |                 |
  |             |--SELECT------->|                 |
  |             |  responses+     |                 |
  |             |  answers        |                 |
  |             |<--Data---------|                 |
  |             |                 |                 |
  |<--Gráficos--|                 |                 |
  |             |                 |                 |
```

---

## Próximos Pasos / Mejoras Futuras

1. **Edición de encuestas** después de creadas
2. **Duplicar encuestas** existentes
3. **Plantillas** de encuestas predefinidas
4. **Notificaciones** cuando se reciben respuestas
5. **Compartir resultados** con terceros
6. **Exportar a PDF** además de CSV
7. **Dashboard analytics** mejorado
8. **Encuestas con lógica condicional** (skip logic)
9. **Modo oscuro** completo
10. **Multiidioma** (i18n)

---

**Última actualización:** Diciembre 2025
