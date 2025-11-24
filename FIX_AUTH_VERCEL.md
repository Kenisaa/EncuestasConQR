# Solución Rápida: Emails de Confirmación Apuntan a Localhost

## Problema
Te registraste desde Vercel pero el email de confirmación tiene un link a `localhost` en lugar de tu URL de Vercel.

## Solución

### Paso 1: Configurar Supabase URLs

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a `Authentication` → `URL Configuration`
4. Configura:

   **Site URL:**
   ```
   https://tu-proyecto.vercel.app
   ```
   (Reemplaza con tu URL real de Vercel)

   **Redirect URLs** (agrega estas líneas):
   ```
   https://tu-proyecto.vercel.app/**
   https://tu-proyecto.vercel.app/dashboard
   http://localhost:3000/**
   http://localhost:3000/dashboard
   ```

5. Click en "Save"

### Paso 2: Agregar Variable de Entorno en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a `Settings` → `Environment Variables`
3. Agrega una nueva variable:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://tu-proyecto.vercel.app` (tu URL de Vercel)
   - **Environment**: Selecciona Production, Preview, y Development
4. Click en "Save"

### Paso 3: Subir Cambios y Redeploy

```bash
# Agregar los cambios
git add .

# Crear commit
git commit -m "Fix: Configure email redirect URL for Vercel deployment"

# Subir a GitHub
git push origin main
```

Vercel automáticamente hará redeploy con la nueva variable de entorno.

### Paso 4: Confirmar el Usuario Actual (Temporal)

Tienes 2 opciones para el usuario que ya se registró:

**Opción A: Confirmar manualmente desde Supabase (RÁPIDO)**

1. Ve a Supabase Dashboard → `Authentication` → `Users`
2. Encuentra el usuario que se registró
3. Si ves que `email_confirmed_at` está vacío:
   - Click en el icono de los 3 puntos al lado del usuario
   - Selecciona "Send magic link" para reenviar el email
   - O edita el usuario y marca como confirmado

**Opción B: Registrarse de nuevo (RECOMENDADO)**

Después del redeploy:
1. Usa un nuevo email para registrarte
2. El email de confirmación ahora tendrá el link correcto
3. Confirma desde el email
4. Elimina el usuario anterior de Supabase si quieres

### Paso 5: Verificar que Funciona

1. Espera a que termine el deployment en Vercel (1-2 minutos)
2. Ve a tu sitio en Vercel
3. Regístrate con un nuevo email
4. Revisa tu correo
5. El link de confirmación debe apuntar a `https://tu-proyecto.vercel.app/dashboard`
6. Click en el link para confirmar
7. Deberías ser redirigido al dashboard

## Verificación de Configuración

Para asegurarte de que todo está correcto:

### En Supabase:
- [ ] Site URL configurado con tu dominio de Vercel
- [ ] Redirect URLs incluyen tu dominio de Vercel
- [ ] Email provider está configurado (o usando el default de Supabase)

### En Vercel:
- [ ] Variable `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] Variable `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] Variable `NEXT_PUBLIC_SITE_URL` configurada (NUEVA)
- [ ] Deployment exitoso sin errores

### En el Código:
- [ ] Los cambios están en GitHub (git push completado)
- [ ] Vercel detectó el push y redesplegó automáticamente

## Problemas Comunes

### El email sigue apuntando a localhost
- Asegúrate de que agregaste `NEXT_PUBLIC_SITE_URL` en Vercel
- Verifica que el redeploy se completó exitosamente
- Limpia el caché del navegador y vuelve a registrarte

### Error "Invalid redirect URL"
- Verifica que agregaste las Redirect URLs en Supabase
- Asegúrate de incluir `/**` al final para permitir todas las sub-rutas

### No llega el email de confirmación
- Revisa la carpeta de spam
- Ve a Supabase → `Authentication` → `Users` para ver si el usuario existe
- Si usas el email default de Supabase, puede haber demora de hasta 5 minutos

### Para desarrollo local
No necesitas hacer nada extra. El código usa:
```javascript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
```

Esto significa:
- En producción (Vercel): usa `NEXT_PUBLIC_SITE_URL` (tu URL de Vercel)
- En desarrollo (localhost): usa `window.location.origin` (http://localhost:3000)

## Resumen de Archivos Modificados

- `.env.example`: Agregada variable `NEXT_PUBLIC_SITE_URL`
- `app/registro/page.tsx`: Actualizado para usar `NEXT_PUBLIC_SITE_URL`
- `VERCEL_DEPLOY.md`: Actualizada documentación con configuración de URLs

## Siguiente Paso

Después de hacer estos cambios, haz las pruebas y si todo funciona correctamente, también deberías actualizar tu archivo `.env.local`:

```bash
# Agrega esta línea a tu .env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

Esto asegura que en desarrollo local también funcione correctamente.
