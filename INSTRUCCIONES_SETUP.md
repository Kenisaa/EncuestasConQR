# 📋 Instrucciones de Setup - Sistema de Encuestas QR

## ✅ Lo que ya está hecho:

- ✅ Credenciales de Supabase configuradas en `.env`
- ✅ Proyecto compilado y funcionando
- ✅ Página de crear encuesta agregada

## 🚀 Lo que debes hacer AHORA:

### Paso 1: Crear las tablas en Supabase (OBLIGATORIO)

**Opción A - Copiar y pegar (Recomendado):**

1. Abre este archivo en tu editor: `scripts/001_create_tables.sql`
2. Selecciona TODO el contenido (Cmd+A o Ctrl+A)
3. Cópialo (Cmd+C o Ctrl+C)
4. Ve a: https://supabase.com/dashboard/project/rrryfwtynrxvgmlkxudf/sql/new
5. Pega el SQL en el editor
6. Haz clic en **RUN** (botón verde abajo a la derecha)
7. Deberías ver: ✅ **Success. No rows returned**

**Opción B - Usar el SQL Editor:**

1. Ve a tu proyecto: https://supabase.com/dashboard/project/rrryfwtynrxvgmlkxudf
2. Click en **SQL Editor** (icono </> en el menú lateral izquierdo)
3. Click en **+ New query**
4. Pega el contenido de `scripts/001_create_tables.sql`
5. Click en **RUN**

### Paso 2: Verificar las tablas

1. En Supabase, ve a **Table Editor** (icono de tabla)
2. Deberías ver estas tablas:
   ```
   - profiles
   - surveys
   - questions
   - responses
   - answers
   ```

Si ves las 5 tablas, ¡perfecto! ✅

### Paso 3: Configurar autenticación (Opcional pero recomendado)

1. Ve a **Authentication** → **Settings**
2. Busca **"Enable email confirmations"**
3. **Desactívalo** (toggle a gris/off)
   - Esto es solo para desarrollo
   - En producción déjalo activado

### Paso 4: Iniciar el proyecto

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:3000**

## 🧪 Probar que todo funciona:

### 1. Registro de usuario
- Ve a http://localhost:3000/registro
- Crea una cuenta con tu email
- Deberías ser redirigido a `/registro/exito`

### 2. Iniciar sesión
- Ve a http://localhost:3000/login
- Ingresa tus credenciales
- Deberías ver el Dashboard

### 3. Crear encuesta
- En el Dashboard, click en **"Nueva Encuesta"**
- Deberías ver el formulario de creación
- Llena el formulario:
  - Título: "Mi primera encuesta"
  - Descripción: "Encuesta de prueba"
  - Agrega una pregunta de tipo "Texto"
- Click en **"Crear Encuesta"**
- Deberías volver al Dashboard y ver tu encuesta

### 4. Verificar en Supabase
- Ve a **Table Editor** → **surveys**
- Deberías ver tu encuesta creada
- Ve a **Table Editor** → **questions**
- Deberías ver las preguntas de tu encuesta

## ❌ Si algo falla:

### Error: "No tienes encuestas todavía"
- ✅ Esto es normal si acabas de crear tu cuenta
- Click en "Nueva Encuesta" para crear una

### Error: Pantalla blanca
- Abre la consola del navegador (F12)
- Busca errores en rojo
- Probablemente son las tablas que no se crearon

### Error: "relation does not exist"
- Las tablas NO se crearon en Supabase
- Ejecuta el SQL del Paso 1

### Error: "Invalid API key"
- Verifica que el `.env` tenga las credenciales correctas
- Reinicia el servidor (`npm run dev`)

### Error: No puedo registrarme
- Verifica que Email esté habilitado en **Authentication** → **Providers**
- Desactiva la confirmación de email (Paso 3)

## 📝 Notas importantes:

1. **Siempre ejecuta el SQL primero** antes de usar la aplicación
2. Las credenciales en `.env` son las correctas: `rrryfwtynrxvgmlkxudf`
3. El proyecto usa React + Vite (no Next.js)
4. Supabase maneja la base de datos y autenticación

## 🎯 Siguiente paso después del setup:

Una vez que todo funcione, puedes:
- Crear más encuestas
- Ver resultados (cuando agregue esa página)
- Generar códigos QR para compartir

## 🆘 Si necesitas ayuda:

1. Revisa los logs en la terminal donde corre `npm run dev`
2. Revisa la consola del navegador (F12)
3. Verifica las tablas en Supabase Table Editor
4. Verifica los usuarios en Authentication → Users

---

**¿Todo listo?** Ejecuta: `npm run dev` y ve a http://localhost:3000
