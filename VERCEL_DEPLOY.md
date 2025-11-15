# Guía de Deploy en Vercel con CI/CD desde GitHub

## Configuración completada ✓

Los siguientes archivos ya están configurados:
- `vercel.json`: Configuración de build para Vite + React
- `.vercelignore`: Optimización del deployment
- `.gitignore`: Protección de archivos sensibles

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

Vercel detectará automáticamente que es un proyecto Vite. Verifica que la configuración sea:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Configurar Variables de Entorno

**MUY IMPORTANTE**: Antes de hacer deploy, agrega las variables de entorno:

1. En la página de configuración del proyecto, ve a "Environment Variables"
2. Agrega las siguientes variables:

```
VITE_SUPABASE_URL=https://dsvnmhgotthyzlpytxcy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdm5taGdvdHRoeXpscHl0eGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjE0MzEsImV4cCI6MjA3ODYzNzQzMX0.YcEe2KHTF4XW3riWW7kD-RqQQ4L5KhWqBV8P-PiBhR4
VITE_SITE_URL=https://tu-proyecto.vercel.app
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

- Confirma que las variables empiecen con `VITE_`
- Verifica que estén configuradas en Vercel
- Haz un redeploy después de agregar variables

### Rutas no funcionan (404)

- Ya está configurado en `vercel.json` con rewrites
- Si persiste, verifica que uses React Router correctamente

## Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite en Vercel](https://vercel.com/docs/frameworks/vite)
- [Dashboard de Vercel](https://vercel.com/dashboard)
