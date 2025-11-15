# CÓMO USAR - Sistema de Encuestas QR

## PASO 1: Crear las tablas en Supabase

### Opción Rápida (Recomendada):

1. Abre el archivo `scripts/001_create_tables.sql` con tu editor de texto
2. Selecciona TODO y copia (Ctrl+A, luego Ctrl+C)
3. Ve a este link: https://supabase.com/dashboard/project/rrryfwtynrxvgmlkxudf/sql/new
4. Pega el código SQL
5. Click en el botón RUN (verde, abajo a la derecha)
6. Deberías ver: "Success. No rows returned"

### Verificar:

Ve a Table Editor en Supabase y verifica que veas estas 5 tablas:
- profiles
- surveys
- questions
- responses
- answers

## PASO 2: Desactivar confirmación de email (solo desarrollo)

1. En Supabase, ve a Authentication -> Settings
2. Busca "Enable email confirmations"
3. Apágalo (desactiva el toggle)

## PASO 3: Iniciar el proyecto

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
npm run dev
```

## PASO 4: Probar

Abre tu navegador en: http://localhost:3000

1. Haz click en "Registrarse"
2. Crea una cuenta con tu email
3. Inicia sesión
4. Click en "Nueva Encuesta"
5. Llena el formulario y crea tu primera encuesta

## SI ALGO NO FUNCIONA:

### Página en blanco al crear encuesta
- Revisa que hayas ejecutado el SQL (Paso 1)
- Abre la consola del navegador (F12) y busca errores

### No puedo registrarme
- Verifica que desactivaste la confirmación de email (Paso 2)
- Verifica que Email esté habilitado en Authentication -> Providers

### Error "relation does not exist"
- NO ejecutaste el SQL del Paso 1
- Ve a Supabase y ejecuta el archivo 001_create_tables.sql

## ARCHIVOS IMPORTANTES:

- `.env` - Tus credenciales de Supabase (ya configurado)
- `scripts/001_create_tables.sql` - SQL para crear las tablas (debes ejecutarlo)
- `INSTRUCCIONES_SETUP.md` - Instrucciones detalladas

## RESUMEN:

1. Ejecuta el SQL en Supabase
2. Desactiva confirmación de email
3. npm run dev
4. Ve a localhost:3000
5. Regístrate y crea encuestas

Eso es todo!
