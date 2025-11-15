# Solución de Problemas - Autenticación

## Problema: Los usuarios registrados no aparecen en Supabase

### Diagnóstico

Hay varias razones por las que un usuario registrado no aparece en Supabase:

#### 1. Confirmación de Email Requerida (MÁS COMÚN)

Por defecto, Supabase requiere que los usuarios confirmen su email antes de que la cuenta se active completamente.

**Cómo verificar:**
1. Ve a tu proyecto en Supabase Dashboard
2. Ve a `Authentication` → `Users`
3. Busca usuarios con estado "Waiting for verification" o similar
4. Revisa la columna `email_confirmed_at` - si está vacía, el usuario no ha confirmado

**Cómo solucionarlo:**

**Opción A: Desactivar confirmación de email (solo para desarrollo/testing)**

1. En Supabase Dashboard, ve a `Authentication` → `Providers` → `Email`
2. Desactiva "Confirm email"
3. Guarda los cambios
4. Intenta registrarte de nuevo

**Opción B: Confirmar usuarios manualmente (desarrollo)**

1. Ve a `Authentication` → `Users`
2. Encuentra el usuario
3. Click en los 3 puntos → "Send magic link" o confirma manualmente

**Opción C: Configurar email templates (producción - RECOMENDADO)**

1. Ve a `Authentication` → `Email Templates`
2. Configura el template de "Confirm signup"
3. Asegúrate de que la URL de confirmación apunte a tu dominio de Vercel
4. El usuario recibirá un email con un link de confirmación

#### 2. Errores en la Consola del Navegador

**Cómo verificar:**
1. Abre las Developer Tools en tu navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta registrarte
4. Busca errores en rojo

**Errores comunes:**
- `Invalid API key`: Las variables de entorno en Vercel están mal configuradas
- `CORS error`: Necesitas agregar tu dominio de Vercel a los "Site URLs" permitidos
- `User already registered`: El email ya fue usado (revisa en Supabase si existe)

#### 3. Variables de Entorno Incorrectas en Vercel

**Cómo verificar:**
1. Ve a tu proyecto en Vercel Dashboard
2. Ve a `Settings` → `Environment Variables`
3. Confirma que existan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Los valores deben coincidir con los de tu `.env` local

**Si faltan o están incorrectas:**
1. Agrégalas/corrígelas en Vercel
2. Ve a `Deployments`
3. Click en los 3 puntos del último deployment → `Redeploy`

#### 4. URL del Sitio no Configurada en Supabase

**Cómo verificar y solucionar:**
1. En Supabase Dashboard, ve a `Authentication` → `URL Configuration`
2. En "Site URL", agrega tu URL de Vercel: `https://tu-proyecto.vercel.app`
3. En "Redirect URLs", agrega:
   - `https://tu-proyecto.vercel.app/dashboard`
   - `https://tu-proyecto.vercel.app/**`
4. Guarda los cambios

#### 5. El Registro está Deshabilitado

**Cómo verificar:**
1. Ve a `Authentication` → `Providers`
2. Asegúrate de que "Email" esté habilitado
3. Verifica que "Enable sign ups" esté activado

### Pasos para Diagnosticar (en orden)

1. **Verifica la consola del navegador** al momento de registrarte
   - ¿Hay algún error?
   - ¿El request se completó exitosamente?

2. **Revisa Supabase Auth Users**
   - Ve a `Authentication` → `Users`
   - ¿Aparece el usuario?
   - ¿Cuál es su estado? (`email_confirmed_at` vacío = no confirmado)

3. **Verifica la configuración de Email en Supabase**
   - `Authentication` → `Providers` → `Email`
   - ¿Está "Confirm email" activado?

4. **Revisa las variables de entorno en Vercel**
   - ¿Están configuradas correctamente?
   - ¿Coinciden con tu proyecto de Supabase?

5. **Verifica las URLs permitidas**
   - `Authentication` → `URL Configuration`
   - ¿Está tu dominio de Vercel agregado?

### Solución Rápida para Testing (NO para producción)

Si solo quieres probar rápidamente sin configurar emails:

1. **Desactiva confirmación de email:**
   - Supabase Dashboard → `Authentication` → `Providers` → `Email`
   - Desactiva "Confirm email"

2. **Permite Auto-confirm:**
   - En algunos casos necesitas habilitar "Enable auto-confirm" para desarrollo

3. **Registra nuevo usuario:**
   - Usa un email diferente al que ya probaste
   - El usuario debería aparecer inmediatamente en la tabla de usuarios

### Verificar Logs en Vercel

Si el problema persiste en producción:

1. Ve a tu proyecto en Vercel
2. Ve a `Deployments` → Click en el deployment actual
3. Ve a la pestaña `Functions` o `Logs`
4. Busca errores relacionados con Supabase

### Solución para Producción

Para producción, debes configurar correctamente el envío de emails:

1. **Configura un proveedor de email en Supabase:**
   - `Project Settings` → `Auth` → `SMTP Settings`
   - Puedes usar servicios como SendGrid, Mailgun, etc.
   - O usa el email predeterminado de Supabase (limitado)

2. **Personaliza los email templates:**
   - `Authentication` → `Email Templates`
   - Edita "Confirm signup" para que apunte a tu dominio

3. **Configura las URLs correctas:**
   - Site URL: `https://tu-proyecto.vercel.app`
   - Redirect URLs: Incluye todas las rutas necesarias

### Comandos Útiles para Debugging

**Ver errores en el registro local:**
```javascript
// En Registro.tsx, línea 43-53, el error ya está siendo capturado
// Revisa la consola del navegador para ver el mensaje de error exacto
```

**Verificar si Supabase está conectado:**
```javascript
// Abre la consola del navegador en tu sitio y ejecuta:
const { data: { session } } = await supabase.auth.getSession();
console.log(session);
```

### Contacto con Soporte

Si ninguna solución funciona:
- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
- Revisa la documentación: https://supabase.com/docs/guides/auth
