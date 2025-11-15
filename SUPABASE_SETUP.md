# Guía de Configuración de Supabase

Esta guía te ayudará a configurar Supabase para el Sistema de Encuestas QR.

## Paso 1: Crear cuenta y proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto:
   - Dale un nombre (ej: "encuestas-qr")
   - Elige una contraseña para la base de datos (guárdala!)
   - Selecciona la región más cercana

## Paso 2: Obtener credenciales

Una vez creado el proyecto:

1. En el dashboard, ve a **Settings** (⚙️) → **API**
2. Encontrarás:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJ...`

3. Copia estos valores y pégalos en el archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 3: Configurar la base de datos

### 3.1 Ejecutar el script SQL

1. En el dashboard de Supabase, ve a **SQL Editor** (icono </> en el menú lateral)
2. Haz clic en **+ New query**
3. Abre el archivo `scripts/001_create_tables.sql` de este proyecto
4. Copia todo el contenido y pégalo en el editor SQL
5. Haz clic en **RUN** (o presiona `Ctrl/Cmd + Enter`)

Esto creará:
- ✅ Tablas: `profiles`, `surveys`, `questions`, `responses`, `answers`
- ✅ Políticas de seguridad (Row Level Security)
- ✅ Trigger para crear perfiles automáticamente
- ✅ Índices para mejorar el rendimiento

### 3.2 Verificar que las tablas se crearon

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver las siguientes tablas:
   - `profiles`
   - `surveys`
   - `questions`
   - `responses`
   - `answers`

## Paso 4: Configurar autenticación

1. Ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado
3. Opcional: Configura otros proveedores (Google, GitHub, etc.)

### Configurar confirmación de email (Opcional)

Por defecto, Supabase requiere que los usuarios confirmen su email:

1. Ve a **Authentication** → **Settings**
2. En **Email Confirmation**, puedes:
   - **Dejarlo activado** (recomendado para producción): Los usuarios recibirán un email de confirmación
   - **Desactivarlo** (solo para desarrollo): Los usuarios pueden iniciar sesión inmediatamente

3. Para desarrollo local, también puedes configurar:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**`

## Paso 5: Verificar configuración

Ahora puedes probar tu aplicación:

```bash
npm run dev
```

Ve a `http://localhost:3000` y:

1. Crea una cuenta nueva (Registro)
2. Verifica que puedas iniciar sesión
3. Intenta crear una encuesta

## Estructura de la base de datos

### Tablas principales:

**profiles**
- `id`: UUID (referencia a auth.users)
- `email`: Email del usuario
- `nombre`: Nombre del usuario

**surveys**
- `id`: UUID
- `user_id`: UUID (dueño de la encuesta)
- `titulo`: Título de la encuesta
- `descripcion`: Descripción
- `activa`: Boolean (si está activa para respuestas)

**questions**
- `id`: UUID
- `survey_id`: UUID (encuesta a la que pertenece)
- `pregunta`: Texto de la pregunta
- `tipo`: 'texto' | 'opcion_multiple' | 'calificacion' | 'si_no'
- `opciones`: JSON (para opciones múltiples)
- `orden`: Número de orden
- `requerida`: Boolean

**responses**
- `id`: UUID
- `survey_id`: UUID
- `respondente_nombre`: Nombre del que responde (opcional)
- `respondente_email`: Email del que responde (opcional)

**answers**
- `id`: UUID
- `response_id`: UUID
- `question_id`: UUID
- `respuesta`: Texto de la respuesta

## Seguridad (Row Level Security)

El script configura automáticamente políticas de seguridad:

✅ **Los usuarios solo pueden ver sus propias encuestas**
✅ **Cualquiera puede responder encuestas activas (anónimamente)**
✅ **Los dueños de encuestas pueden ver todas las respuestas**
✅ **Los perfiles son privados (cada usuario ve solo el suyo)**

## Solución de problemas

### Error: "No puedo crear encuestas"
- Verifica que las tablas se crearon correctamente
- Verifica que las políticas RLS estén activas
- Revisa la consola del navegador para errores específicos

### Error: "Invalid API key"
- Verifica que copiaste correctamente las credenciales
- Asegúrate de estar usando la **anon/public key** (no la service_role)
- Reinicia el servidor de desarrollo después de cambiar el `.env`

### Error: "relation does not exist"
- Las tablas no se crearon correctamente
- Ejecuta nuevamente el script SQL

### Los usuarios no pueden registrarse
- Verifica la configuración de Email en Authentication → Providers
- Revisa si hay emails de confirmación en tu bandeja de entrada (o spam)

## Recursos adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

Si tienes problemas, revisa los logs en:
- **Logs** en el dashboard de Supabase
- Consola del navegador (F12)
- Terminal donde corre `npm run dev`
