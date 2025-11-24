# Guía de Deploy en Vercel con CI/CD desde GitHub

## Configuración completada ✓

Los siguientes archivos ya están configurados:
- Next.js configuración (next.config.mjs)
- `.gitignore`: Protección de archivos sensibles
- Variables de entorno para Next.js

## Pasos para hacer el deploy

### 1. Preparar el repositorio en GitHub

```bash
# Agrega los archivos de configuración
git add vercel.json .vercelignore VERCEL_DEPLOY.md

# Crea el commit
git commit -m "Add Vercel deployment configuration"

# Sube los cambios a GitHub
git push origin main
```

### 2. Conectar Vercel con GitHub

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub
2. Click en "Add New..." → "Project"
3. Busca tu repositorio `EncuestaQR` y click en "Import"

### 3. Configurar el proyecto en Vercel

Vercel detectará automáticamente que es un proyecto Next.js. Verifica que la configuración sea:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: (automático para Next.js)
- **Install Command**: `npm install`

### 4. Configurar Variables de Entorno

**MUY IMPORTANTE**: Antes de hacer deploy, agrega las variables de entorno:

1. En la página de configuración del proyecto, ve a "Environment Variables"
2. Agrega las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

**IMPORTANTE**: Reemplaza `https://tu-proyecto.vercel.app` con tu URL real de Vercel

3. Asegúrate de que estas variables estén disponibles para todos los ambientes (Production, Preview, Development)

### 4.5. Configurar URLs en Supabase (CRÍTICO para autenticación)

**DEBE hacerse ANTES del primer deploy**, de lo contrario los emails de confirmación no funcionarán:

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a `Authentication` → `URL Configuration`
3. Configura lo siguiente:

   - **Site URL**: `https://tu-proyecto.vercel.app` (reemplaza con tu URL de Vercel)
   - **Redirect URLs**: Agrega las siguientes URLs (una por línea):
     ```
     https://tu-proyecto.vercel.app/**
     https://tu-proyecto.vercel.app/dashboard
     http://localhost:3000/**
     http://localhost:3000/dashboard
     ```

4. Guarda los cambios

**Nota**: Si ya desplegaste y los emails de confirmación apuntan a localhost, necesitarás:
   - Configurar estas URLs en Supabase
   - Hacer redeploy en Vercel después de agregar `VITE_SITE_URL`
   - Los usuarios que ya se registraron deberán registrarse de nuevo (o confirmarlos manualmente desde Supabase)

### 5. Deploy

1. Click en "Deploy"
2. Vercel comenzará el build automáticamente
3. Espera a que termine el deployment (2-3 minutos)
4. Obtendrás una URL de producción como: `https://tu-proyecto.vercel.app`

## CI/CD Automático configurado ✓

Una vez conectado, Vercel automáticamente:

- **Deployment de producción**: Cada push a `main` o `master`
- **Preview deployments**: Cada pull request creará un preview único
- **Comentarios en PRs**: Vercel comentará en tus PRs con el link del preview
- **Rollbacks**: Puedes hacer rollback a deployments anteriores desde el dashboard

## Comandos útiles

```bash
# Ver el estado del repositorio
git status

# Hacer push de cambios
git add .
git commit -m "Tu mensaje"
git push origin main

# Crear una rama para preview
git checkout -b feature/nueva-funcionalidad
git push origin feature/nueva-funcionalidad
# Esto creará un preview deployment automático
```

## Verificar después del deploy

1. Visita tu URL de Vercel
2. Verifica que la aplicación cargue correctamente
3. Prueba el login/registro para confirmar que Supabase esté conectado
4. Revisa los logs en el dashboard de Vercel si hay errores

## Actualizar variables de entorno

Si necesitas cambiar las variables de entorno:

1. Ve al dashboard de Vercel → Tu proyecto → Settings → Environment Variables
2. Edita o agrega las variables necesarias
3. Redeploy el proyecto para que apliquen los cambios

## Dominios personalizados (Opcional)

Para agregar un dominio personalizado:

1. Ve a Settings → Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones de Vercel

## Problemas comunes

### El build falla

- Revisa los logs en el dashboard de Vercel
- Asegúrate de que `npm run build` funcione localmente
- Verifica que todas las dependencias estén en `package.json`

### Variables de entorno no funcionan

- Confirma que las variables empiecen con `NEXT_PUBLIC_` para ser accesibles en el cliente
- Verifica que estén configuradas en Vercel
- Haz un redeploy después de agregar variables

### Rutas no funcionan (404)

- Next.js maneja las rutas automáticamente con el App Router
- Si persiste, verifica que la estructura de carpetas en `app/` sea correcta

## Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Dashboard de Vercel](https://vercel.com/dashboard)
