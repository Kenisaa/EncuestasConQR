# Guía de Deploy en Render

Esta guía te ayudará a desplegar el Sistema de Encuestas QR en Render.

## Requisitos Previos

- Cuenta en [Render](https://render.com)
- Repositorio en GitHub con el código
- Proyecto de Supabase configurado

## Configuración Rápida

### 1. Conectar Repositorio

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Selecciona el repositorio `EncuestasConQR`
5. Click en **"Connect"**

### 2. Configuración del Servicio

Render debería detectar automáticamente que es un proyecto Next.js. Verifica o configura:

**Información Básica:**
- **Name**: `encuestas-qr` (o el nombre que prefieras)
- **Region**: Selecciona la más cercana (ej: Oregon)
- **Branch**: `main`

**Build & Deploy:**
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Plan:**
- Selecciona el plan **Free** (o el que prefieras)

### 3. Variables de Entorno

**IMPORTANTE:** Antes de hacer el deploy, configura las variables de entorno:

En la sección **"Environment"**, agrega las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_SITE_URL=https://tu-app.onrender.com
```

**Dónde encontrar tus credenciales de Supabase:**
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Para `NEXT_PUBLIC_SITE_URL`:**
- Primero deja este campo en blanco
- Después del primer deploy, Render te dará una URL (ej: `https://encuestas-qr-abc123.onrender.com`)
- Vuelve a **Environment** y agrega esa URL
- Click en **"Save Changes"** (esto hará un redeploy automático)

### 4. Configurar Supabase

**CRÍTICO:** Debes configurar las URLs permitidas en Supabase:

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Authentication** → **URL Configuration**
3. Configura:

   **Site URL:**
   ```
   https://tu-app.onrender.com
   ```
   (Reemplaza con tu URL real de Render)

   **Redirect URLs** (agrega estas líneas):
   ```
   https://tu-app.onrender.com/**
   https://tu-app.onrender.com/dashboard
   http://localhost:3000/**
   http://localhost:3000/dashboard
   ```

4. Click en **"Save"**

### 5. Iniciar Deploy

1. Revisa que todas las configuraciones sean correctas
2. Click en **"Create Web Service"**
3. Render comenzará el build automáticamente (toma 5-10 minutos)
4. Espera a que el status cambie a **"Live"**

### 6. Verificar Deployment

Una vez que el deploy termine:

1. Click en la URL de tu app (ej: `https://encuestas-qr-abc123.onrender.com`)
2. Verifica que la página cargue
3. Intenta registrarte con un email
4. Verifica el login
5. Crea una encuesta de prueba

## Archivo render.yaml (Opcional)

El proyecto incluye un archivo `render.yaml` que automatiza la configuración. Si lo usas:

1. En lugar de "Web Service", selecciona **"Blueprint"**
2. Render detectará el `render.yaml` automáticamente
3. Solo necesitas configurar las variables de entorno manualmente

## Actualizaciones Automáticas (CI/CD)

Una vez configurado, Render automáticamente:
- ✅ Hace deploy en cada push a `main`
- ✅ Ejecuta el build command
- ✅ Reinicia el servicio si hay cambios
- ✅ Mantiene logs disponibles

Para hacer deploy de cambios:
```bash
git add .
git commit -m "Tu mensaje"
git push origin main
```

Render detectará el push y hará redeploy automáticamente.

## Configuración Avanzada

### Custom Domain (Opcional)

Para usar tu propio dominio:

1. En Render, ve a tu servicio → **Settings** → **Custom Domain**
2. Click en **"Add Custom Domain"**
3. Ingresa tu dominio (ej: `encuestas.tudominio.com`)
4. Configura los DNS según las instrucciones de Render
5. Actualiza `NEXT_PUBLIC_SITE_URL` con tu dominio personalizado
6. Actualiza las URLs en Supabase también

### Logs y Monitoreo

Para ver logs:
1. Ve a tu servicio en Render Dashboard
2. Click en la pestaña **"Logs"**
3. Verás los logs en tiempo real

### Redeploy Manual

Si necesitas hacer redeploy sin cambios en el código:
1. Ve a tu servicio → **Manual Deploy**
2. Click en **"Clear build cache & deploy"** (si hay problemas de caché)
3. O click en **"Deploy latest commit"** para redeploy normal

## Solución de Problemas

### Build Falla

**Error: "command not found" o "module not found"**
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que el build command sea correcto: `npm install && npm run build`
- Revisa los logs para ver el error específico

**Error: "Out of memory"**
- El plan Free de Render tiene límite de memoria
- Puedes intentar optimizar el build o usar un plan pagado

### Variables de Entorno No Funcionan

- Verifica que tengan el prefijo `NEXT_PUBLIC_`
- Asegúrate de hacer redeploy después de agregar variables
- Las variables se aplican solo después de un nuevo deploy

### La App No Carga

- Verifica que el Start Command sea `npm start`
- Revisa los logs en Render para ver errores
- Asegúrate de que el puerto usado sea el default de Next.js (3000)

### Error 500 en Producción

- Revisa los logs en Render
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de que las tablas en Supabase estén creadas

### Emails de Confirmación Apuntan a Localhost

- Verifica que `NEXT_PUBLIC_SITE_URL` esté configurado en Render
- Asegúrate de que la Site URL en Supabase sea tu URL de Render
- Haz redeploy después de configurar

### Base de Datos No Conecta

- Verifica las variables de Supabase en Render
- Ve a Supabase Dashboard → Settings → API para confirmar credenciales
- Asegúrate de que las políticas RLS estén activas en Supabase

## Plan Free de Render - Limitaciones

El plan Free tiene algunas limitaciones:
- ⚠️ El servicio se duerme después de 15 minutos de inactividad
- ⚠️ Primera petición después del sleep toma ~30 segundos
- ⚠️ 750 horas gratis por mes (suficiente para un proyecto)
- ⚠️ Builds más lentos que planes pagados

**Para mantener el servicio activo:**
- Usa un servicio como [UptimeRobot](https://uptimerobot.com/) para hacer ping cada 10 minutos
- O considera un plan pagado ($7/mes) para tener el servicio siempre activo

## Comparación: Render vs Vercel

| Feature | Render | Vercel |
|---------|--------|--------|
| Plan Free | ✅ Sí | ✅ Sí |
| Auto Deploy | ✅ Sí | ✅ Sí |
| Custom Domain | ✅ Sí | ✅ Sí |
| Serverless | ❌ No | ✅ Sí |
| Always On | ❌ No (se duerme) | ✅ Sí |
| Setup | Más manual | Más automático |

**Recomendación:**
- **Vercel** es mejor para Next.js (integración nativa)
- **Render** es bueno si necesitas más control o servicios adicionales (DB, cron jobs, etc.)

## Recursos

- [Documentación de Render](https://render.com/docs)
- [Guía de Next.js en Render](https://render.com/docs/deploy-nextjs-app)
- [Dashboard de Render](https://dashboard.render.com/)
- [Supabase Dashboard](https://supabase.com/dashboard)

## Soporte

Si tienes problemas:
1. Revisa los logs en Render Dashboard
2. Verifica la consola del navegador (F12)
3. Consulta [Render Community](https://community.render.com/)
4. Revisa [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Nota:** Este proyecto está optimizado para Vercel, pero funciona perfectamente en Render con esta configuración.
