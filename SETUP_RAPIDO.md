# 🚀 Setup Rápido - Configuración de Supabase

## Paso 1: Ejecutar el Script SQL (IMPORTANTE)

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/rrryfwtynrxvgmlkxudf
2. En el menú lateral, busca el icono **</>** o **SQL Editor**
3. Haz clic en **+ New query**
4. Copia TODO el contenido del archivo `scripts/001_create_tables.sql`
5. Pégalo en el editor
6. Haz clic en **RUN** (o presiona Ctrl/Cmd + Enter)

Deberías ver un mensaje: **Success. No rows returned**

## Paso 2: Verificar que las tablas se crearon

1. En el menú lateral, ve a **Table Editor** (icono de tabla)
2. Deberías ver estas 5 tablas:
   - ✅ profiles
   - ✅ surveys
   - ✅ questions
   - ✅ responses
   - ✅ answers

## Paso 3: Configurar Autenticación

1. Ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado (toggle en verde)
3. Ve a **Authentication** → **URL Configuration**
4. En **Site URL** pon: `http://localhost:3000`
5. En **Redirect URLs** agrega: `http://localhost:3000/**`

### Opcional: Deshabilitar confirmación de email (solo para desarrollo)

1. Ve a **Authentication** → **Settings**
2. Busca **Enable email confirmations**
3. Desactívalo (esto es solo para desarrollo local)

## Paso 4: Iniciar el proyecto

```bash
npm run dev
```

Abre tu navegador en: http://localhost:3000

## Paso 5: Probar el sistema

1. **Registrarse**: Ve a http://localhost:3000/registro
   - Crea una cuenta con tu email
   - Si desactivaste la confirmación, podrás iniciar sesión inmediatamente

2. **Iniciar sesión**: Ve a http://localhost:3000/login
   - Ingresa con tus credenciales

3. **Dashboard**: Deberías ver el panel de control

## ⚠️ Problemas Conocidos

### Página en blanco al crear encuesta

El botón "Nueva Encuesta" lleva a `/dashboard/encuestas/nueva` pero esa página aún no existe en React.

**Páginas que faltan por migrar:**
- `/dashboard/encuestas/nueva` - Crear nueva encuesta
- `/dashboard/encuestas/[id]` - Editar encuesta
- `/dashboard/encuestas/[id]/resultados` - Ver resultados
- `/encuesta/[id]` - Vista pública para responder

Estas páginas estaban en Next.js pero no se migraron a React todavía.

## 📊 Estructura de la Base de Datos

```
profiles (usuarios)
  ↓
surveys (encuestas)
  ↓
questions (preguntas)
  ↓
responses (respuestas completas)
  ↓
answers (respuestas individuales por pregunta)
```

## 🔍 Cómo verificar que todo funciona

### En Supabase:

1. **Table Editor** → `profiles`: Deberías ver tu usuario después de registrarte
2. **Authentication** → **Users**: Deberías ver tu email

### En la aplicación:

1. Puedes registrarte ✅
2. Puedes iniciar sesión ✅
3. Ves el dashboard ✅
4. Al dar click en "Nueva Encuesta" → 404 (página no existe aún) ⚠️

## ✅ Solución Rápida

¿Quieres que cree las páginas faltantes para que el sistema funcione completo?

Las páginas necesarias son:
1. Formulario de crear encuesta
2. Formulario de editar encuesta
3. Vista de resultados con gráficos
4. Vista pública para responder encuestas
