# GitHub Actions - CI/CD Pipeline

Este documento explica el flujo completo de GitHub Actions configurado en el proyecto EncuestasQR, incluyendo integración continua (CI) y despliegue continuo (CD).

---

## Tabla de Contenidos

1. [¿Qué es GitHub Actions?](#qué-es-github-actions)
2. [Workflows Configurados](#workflows-configurados)
3. [Flujo de CI (Integración Continua)](#flujo-de-ci-integración-continua)
4. [Flujo de CD (Despliegue Continuo)](#flujo-de-cd-despliegue-continuo)
5. [Diagrama de Flujo Completo](#diagrama-de-flujo-completo)
6. [Secrets y Variables de Entorno](#secrets-y-variables-de-entorno)
7. [Cómo Funciona en la Práctica](#cómo-funciona-en-la-práctica)
8. [Troubleshooting](#troubleshooting)

---

## ¿Qué es GitHub Actions?

GitHub Actions es una plataforma de automatización que permite ejecutar flujos de trabajo (workflows) automáticamente en respuesta a eventos en tu repositorio de GitHub.

**Beneficios:**
- ✅ Automatización de pruebas
- ✅ Despliegue automático
- ✅ Validación de código antes de merge
- ✅ Detección temprana de errores
- ✅ Consistencia en builds

---

## Workflows Configurados

El proyecto tiene **2 workflows** activos:

### 1. CI (Continuous Integration) - `ci.yml`
**Archivo:** `.github/workflows/ci.yml`
**Se ejecuta:** En Pull Requests a `main`
**Propósito:** Validar código antes de hacer merge

### 2. Deploy (Continuous Deployment) - `deploy.yml`
**Archivo:** `.github/workflows/deploy.yml`
**Se ejecuta:** En push a rama `main`
**Propósito:** Build y notificación de despliegue

---

## Flujo de CI (Integración Continua)

### Archivo: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.16.0'

      - name: Install dependencies
        run: npm install

      - name: Run linter
        run: npm run lint --max-warnings=0 || true

      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co"
          NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-key"
          NEXT_PUBLIC_SITE_URL: "https://placeholder.com"
```

### Explicación Paso a Paso

#### 1. Trigger (Cuándo se ejecuta)
```yaml
on:
  pull_request:
    branches:
      - main
  workflow_dispatch:
```

**Se activa cuando:**
- Alguien crea un Pull Request hacia `main`
- Alguien actualiza un Pull Request existente
- Se ejecuta manualmente desde GitHub (`workflow_dispatch`)

**NO se ejecuta cuando:**
- Haces push directo a `main`
- Trabajas en otras ramas sin PR

---

#### 2. Permisos
```yaml
permissions:
  contents: read
```
- Solo lectura del código
- Seguridad: no puede modificar el repositorio

---

#### 3. Job: Test

**Entorno de ejecución:**
```yaml
runs-on: ubuntu-latest
```
- Máquina virtual Ubuntu (Linux)
- Última versión estable
- Gratis para repositorios públicos

---

#### 4. Steps (Pasos del Job)

##### Step 1: Checkout code
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
**Qué hace:**
- Descarga el código del repositorio
- Usa la versión del PR

**Resultado:**
```
✅ Código disponible en /home/runner/work/EncuestasQR/EncuestasQR
```

---

##### Step 2: Setup Node.js
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22.16.0'
```
**Qué hace:**
- Instala Node.js versión 22.16.0
- Configura npm automáticamente

**Resultado:**
```
✅ Node.js 22.16.0 instalado
✅ npm disponible
```

---

##### Step 3: Install dependencies
```yaml
- name: Install dependencies
  run: npm install
```
**Qué hace:**
- Ejecuta `npm install`
- Lee `package.json`
- Descarga todas las dependencias en `node_modules/`

**Tiempo aproximado:** 1-3 minutos

**Resultado:**
```
✅ Todas las dependencias instaladas
✅ node_modules/ creado
```

---

##### Step 4: Run linter
```yaml
- name: Run linter
  run: npm run lint --max-warnings=0 || true
```
**Qué hace:**
- Ejecuta ESLint (`npm run lint`)
- `--max-warnings=0`: No permite warnings
- `|| true`: NO falla el workflow si hay errores de lint

**⚠️ Nota:** Actualmente configurado para no bloquear aunque haya errores.

**Resultado:**
```
⚠️ Muestra errores/warnings pero continúa
```

---

##### Step 5: Build project
```yaml
- name: Build project
  run: npm run build
  env:
    NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-key"
    NEXT_PUBLIC_SITE_URL: "https://placeholder.com"
```
**Qué hace:**
- Ejecuta `npm run build` (compila Next.js)
- Usa variables de entorno placeholder (no reales)
- Verifica que el código compila correctamente

**⚠️ Importante:** Si el build falla, el workflow falla ❌

**Resultado:**
```
✅ Build exitoso → Workflow pasa ✅
❌ Build falla → Workflow falla ❌ (PR bloqueado)
```

---

### Resultado Final del Workflow CI

**Si todo pasa:**
```
✅ CI / test
   ✓ Checkout code
   ✓ Setup Node.js
   ✓ Install dependencies
   ✓ Run linter
   ✓ Build project

→ Pull Request puede hacer merge
```

**Si algo falla:**
```
❌ CI / test
   ✓ Checkout code
   ✓ Setup Node.js
   ✓ Install dependencies
   ✓ Run linter
   ❌ Build project (ERROR)

→ Pull Request bloqueado (no se puede mergear)
```

---

## Flujo de CD (Despliegue Continuo)

### Archivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Render

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.16.0'

      - name: Install dependencies
        run: npm install

      - name: Run linter
        run: npm run lint --max-warnings=0 || true

      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

      - name: Deploy to Render
        run: |
          echo "✅ Build successful! Render will auto-deploy from this push."
          echo "Monitor deployment at: https://dashboard.render.com"
```

### Explicación Paso a Paso

#### 1. Trigger
```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

**Se activa cuando:**
- Haces push directo a `main`
- Se mergea un Pull Request a `main`
- Se ejecuta manualmente

---

#### 2. Diferencias con CI

##### Variables de Entorno (Secrets)
```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
  NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
```

**Diferencia clave:**
- ✅ Usa **secrets reales** de GitHub
- ✅ Build con configuración de producción
- ✅ Verifica que el build funciona con datos reales

---

##### Step Final: Deploy to Render
```yaml
- name: Deploy to Render
  run: |
    echo "✅ Build successful! Render will auto-deploy from this push."
    echo "Monitor deployment at: https://dashboard.render.com"
```

**Qué hace:**
- Solo imprime mensajes informativos
- NO despliega directamente

**¿Por qué?**
- Render está configurado para **auto-deploy**
- Render detecta push a `main` automáticamente
- GitHub Actions solo valida que el build funciona

---

### Resultado Final del Workflow Deploy

**Flujo completo:**
```
1. Push a main
   ↓
2. GitHub Actions: Deploy to Render
   ✓ Checkout
   ✓ Setup Node.js
   ✓ Install dependencies
   ✓ Run linter
   ✓ Build (con secrets reales)
   ✓ Mensaje de deploy
   ↓
3. Render detecta push a main
   ↓
4. Render ejecuta su propio build y deploy
   ↓
5. Aplicación actualizada en producción
```

---

## Diagrama de Flujo Completo

### Flujo con Pull Request

```
Developer                    GitHub                    GitHub Actions              Render
    |                          |                             |                        |
    |--Crear PR hacia main---->|                             |                        |
    |                          |                             |                        |
    |                          |---Trigger CI workflow------>|                        |
    |                          |                             |                        |
    |                          |                       [CI ejecuta]                   |
    |                          |                        - Checkout                    |
    |                          |                        - Setup Node                  |
    |                          |                        - npm install                 |
    |                          |                        - npm lint                    |
    |                          |                        - npm build                   |
    |                          |                             |                        |
    |                          |<---✅ CI passed-------------|                        |
    |                          |                             |                        |
    |<--Notificación: CI OK----|                             |                        |
    |                          |                             |                        |
    |--Aprobar y mergear PR--->|                             |                        |
    |                          |                             |                        |
    |                          |--Merge a main-------------->|                        |
    |                          |                             |                        |
    |                          |---Trigger Deploy workflow-->|                        |
    |                          |                             |                        |
    |                          |                       [Deploy ejecuta]               |
    |                          |                        - Checkout                    |
    |                          |                        - Setup Node                  |
    |                          |                        - npm install                 |
    |                          |                        - npm lint                    |
    |                          |                        - npm build (secrets)         |
    |                          |                        - Echo mensaje                |
    |                          |                             |                        |
    |                          |<---✅ Deploy workflow OK----|                        |
    |                          |                             |                        |
    |                          |---Notifica push a main---------------->              |
    |                          |                             |                        |
    |                          |                             |                [Auto-deploy]
    |                          |                             |                 - Git pull
    |                          |                             |                 - npm install
    |                          |                             |                 - npm build
    |                          |                             |                 - Deploy
    |                          |                             |                        |
    |<--Notificación: Deploy OK---------------------------------|                        |
    |                          |                             |                        |
    |--Verificar en producción--------------------------------------------->           |
    |                          |                             |                        |
```

---

### Flujo con Push Directo

```
Developer              GitHub              GitHub Actions         Render
    |                     |                       |                  |
    |--git push origin main-->                    |                  |
    |                     |                       |                  |
    |                     |--Trigger Deploy------>|                  |
    |                     |                       |                  |
    |                     |                [Deploy ejecuta]          |
    |                     |                       |                  |
    |                     |<--✅ Workflow OK------|                  |
    |                     |                       |                  |
    |                     |--Push detectado---------------->         |
    |                     |                       |                  |
    |                     |                       |          [Auto-deploy]
    |                     |                       |                  |
    |<--Deploy OK-----------------------------------------|          |
    |                     |                       |                  |
```

---

## Secrets y Variables de Entorno

### ¿Qué son los Secrets?

Los **Secrets** son variables de entorno seguras almacenadas en GitHub que no son visibles en el código.

### Secrets Configurados

| Secret Name | Descripción | Ejemplo |
|-------------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI...` |
| `NEXT_PUBLIC_SITE_URL` | URL de tu sitio en producción | `https://tu-app.onrender.com` |

### Cómo se Configuran

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Agrega cada secret con su nombre y valor

### Uso en Workflows

```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
```

**Seguridad:**
- ❌ NO se muestran en logs
- ❌ NO son accesibles en forks
- ✅ Solo accesibles en workflows del repo original

---

## Cómo Funciona en la Práctica

### Escenario 1: Desarrollar una nueva feature

```bash
# 1. Crear rama
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios
# ... editar código ...

# 3. Commit y push
git add .
git commit -m "Add: nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub
# → GitHub Actions ejecuta CI workflow automáticamente

# 5. Esperar que CI pase ✅
# → Revisar checks en el PR

# 6. Si CI falla ❌
git add .
git commit -m "Fix: corregir error de build"
git push origin feature/nueva-funcionalidad
# → CI se ejecuta nuevamente

# 7. Una vez que CI pasa ✅
# → Mergear PR a main

# 8. Al mergear
# → Deploy workflow se ejecuta automáticamente
# → Render detecta cambio y despliega
```

---

### Escenario 2: Hotfix urgente

```bash
# 1. Checkout a main
git checkout main
git pull origin main

# 2. Hacer cambio rápido
# ... fix ...

# 3. Commit y push directo
git add .
git commit -m "Fix: error crítico"
git push origin main

# → Deploy workflow se ejecuta inmediatamente
# → Render despliega automáticamente
```

---

## Troubleshooting

### ❌ Problema: CI falla en "Build project"

**Error típico:**
```
Error: Cannot find module 'xyz'
```

**Solución:**
1. Verifica que todas las dependencias estén en `package.json`
2. Ejecuta localmente:
   ```bash
   npm install
   npm run build
   ```
3. Si funciona localmente, revisa errores de TypeScript

---

### ❌ Problema: Deploy falla por secrets

**Error típico:**
```
Error: Invalid Supabase URL
```

**Solución:**
1. Ve a GitHub Settings → Secrets
2. Verifica que los secrets existan
3. Verifica que los valores sean correctos (sin espacios extras)
4. Re-ejecuta el workflow

---

### ❌ Problema: Workflow no se ejecuta

**Posibles causas:**
1. El archivo YAML tiene errores de sintaxis
2. El trigger no coincide (ej: push a rama incorrecta)
3. GitHub Actions está deshabilitado en el repo

**Solución:**
1. Verifica la sintaxis YAML
2. Revisa la pestaña "Actions" en GitHub
3. Settings → Actions → Permissions → Allow all actions

---

### ⚠️ Problema: Workflow pasa pero Render no despliega

**Causa:**
- Render y GitHub Actions son independientes
- GitHub Actions solo valida el build
- Render tiene su propio sistema de auto-deploy

**Solución:**
1. Ve a dashboard.render.com
2. Verifica el estado del servicio
3. Revisa logs de deploy en Render
4. Verifica que Render esté conectado a la rama `main`

---

## Mejoras Futuras

### 1. Tests Automatizados
```yaml
- name: Run tests
  run: npm test
```

### 2. Cache de node_modules
```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
```
**Beneficio:** Builds más rápidos

### 3. Deploy real desde GitHub Actions
```yaml
- name: Deploy to Render
  run: |
    curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

### 4. Notificaciones
```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### 5. Matriz de versiones de Node
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
```

---

## Comandos Útiles

### Ver logs de workflow
```bash
# En GitHub UI
Actions → Selecciona workflow → View logs
```

### Re-ejecutar workflow fallido
```bash
# En GitHub UI
Actions → Workflow fallido → Re-run jobs
```

### Ejecutar workflow manualmente
```bash
# En GitHub UI
Actions → Selecciona workflow → Run workflow
```

### Ver status de workflows
```bash
# Usando GitHub CLI
gh run list
gh run view <run-id>
```

---

## Resumen

| Workflow | Trigger | Propósito | Secrets |
|----------|---------|-----------|---------|
| **CI** | Pull Request → main | Validar código antes de merge | No (usa placeholders) |
| **Deploy** | Push → main | Build con configuración real | Sí (secrets de producción) |

**Flujo ideal:**
```
Feature branch → PR → CI pasa ✅ → Merge → Deploy pasa ✅ → Render despliega ✅
```

---

**Última actualización:** Diciembre 2025
