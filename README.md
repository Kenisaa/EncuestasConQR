# Sistema de Encuestas QR

Sistema de encuestas con códigos QR construido con **React + Vite** y Supabase.

## Cambios Realizados

Este proyecto fue migrado de **Next.js** a **React puro con Vite**. Los cambios incluyen:

### 1. Archivos Eliminados
- ✅ Archivos `._*` de macOS (metadatos innecesarios)
- ✅ Configuración y dependencias de Next.js
- ✅ Archivos de servidor Next.js (`lib/supabase/server.ts`, `lib/supabase/middleware.ts`, `proxy.ts`)

### 2. Nueva Estructura
```
EncuestasQR/
├── src/
│   ├── main.tsx          # Punto de entrada de React
│   ├── App.tsx           # Componente principal con rutas
│   ├── index.css         # Estilos globales (Tailwind)
│   └── pages/            # Páginas de la aplicación
│       ├── Home.tsx
│       ├── Login.tsx
│       ├── Registro.tsx
│       ├── RegistroExito.tsx
│       └── Dashboard.tsx
├── components/           # Componentes reutilizables
├── lib/                  # Utilidades y clientes
├── hooks/                # Hooks personalizados
├── public/               # Archivos estáticos
└── index.html            # HTML principal
```

### 3. Tecnologías Actualizadas
- **React 18** (en lugar de React 19 de Next.js)
- **Vite 5** (bundler rápido)
- **React Router 6** (navegación)
- **Tailwind CSS 3** (estilos)
- **Supabase** (base de datos y autenticación)

## Instalación y Uso

### Requisitos Previos
- Node.js 18+
- npm o pnpm

### Instalar Dependencias
```bash
npm install
```

### Ejecutar en Desarrollo
```bash
npm run dev
```
El servidor estará disponible en: http://localhost:3000

### Compilar para Producción
```bash
npm run build
```
Los archivos compilados estarán en la carpeta `dist/`

### Vista Previa de Producción
```bash
npm run preview
```

## Configuración de Supabase

### 1. Obtén tus credenciales de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Settings** → **API**
3. Encontrarás dos valores importantes:
   - **Project URL** (ejemplo: `https://abcdefgh.supabase.co`)
   - **anon/public key** (una clave larga)

### 2. Configura las variables de entorno

Ya existe un archivo `.env` en la raíz del proyecto. Ábrelo y reemplaza los valores:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 3. Configura la base de datos

Ejecuta el script SQL en tu proyecto de Supabase (en el **SQL Editor**):

```bash
# El archivo está en: scripts/001_create_tables.sql
```

Este script creará las tablas necesarias:
- `surveys` - Encuestas
- `questions` - Preguntas de las encuestas
- `responses` - Respuestas de los usuarios

### 4. Configura las políticas de seguridad (RLS)

Supabase usa Row Level Security (RLS). Asegúrate de configurar las políticas en:
**Authentication** → **Policies** para cada tabla.

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Características

- ✅ Autenticación de usuarios (registro/login)
- ✅ Creación de encuestas personalizadas
- ✅ Generación de códigos QR
- ✅ Múltiples tipos de preguntas (texto, opción múltiple, calificación, sí/no)
- ✅ Visualización de resultados con gráficos
- ✅ Exportación de datos
- ✅ Diseño responsive

## Notas Importantes

### Diferencias con Next.js

1. **Sin Server-Side Rendering (SSR)**: Ahora es una Single Page Application (SPA)
2. **Navegación**: Se usa `react-router-dom` en lugar de Next.js Router
3. **Sin API Routes**: Todas las llamadas a la base de datos se hacen directamente desde el cliente a Supabase
4. **Carga inicial**: Puede ser más rápida en desarrollo pero requiere configuración adicional para SEO

### Páginas No Migradas

Las siguientes páginas avanzadas aún no han sido migradas (estaban en la carpeta `app/`):
- `/encuesta/[id]` - Vista pública de encuesta
- `/dashboard/encuestas/nueva` - Crear nueva encuesta
- `/dashboard/encuestas/[id]` - Editar encuesta
- `/dashboard/encuestas/[id]/resultados` - Ver resultados

Estas se pueden agregar siguiendo el mismo patrón de las páginas ya migradas.

## Próximos Pasos

Para completar el proyecto, considera:

1. Migrar las páginas faltantes a `src/pages/`
2. Configurar variables de entorno para Supabase
3. Agregar rutas protegidas para el dashboard
4. Implementar manejo de errores global
5. Agregar tests unitarios
6. Configurar CI/CD para deployment

## Soporte

Si encuentras algún problema, verifica:
1. Que todas las dependencias estén instaladas
2. Que las variables de entorno de Supabase estén configuradas
3. Que el puerto 3000 esté disponible

---
Generado con Claude Code
