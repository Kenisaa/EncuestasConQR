# Tecnologías Utilizadas en EncuestasQR

Este documento detalla todas las tecnologías, frameworks, librerías y herramientas utilizadas en el proyecto EncuestasQR.

## Stack Principal

### Framework y Lenguaje
- **Next.js 15** - Framework React con App Router para aplicaciones full-stack
- **React 18.2** - Biblioteca JavaScript para interfaces de usuario
- **TypeScript 5** - Lenguaje de programación con tipado estático

### Base de Datos y Backend
- **Supabase** - Plataforma Backend-as-a-Service (BaaS)
  - PostgreSQL como base de datos relacional
  - Supabase Auth para autenticación
  - Row Level Security (RLS) para seguridad de datos
  - **@supabase/supabase-js** - Cliente JavaScript de Supabase
  - **@supabase/ssr** - Utilidades para Server-Side Rendering con Supabase

## Estilos y UI

### CSS y Diseño
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **PostCSS 8.5** - Herramienta para transformar CSS
- **Autoprefixer 10.4** - Plugin de PostCSS para agregar prefijos de navegadores
- **tailwindcss-animate** - Animaciones para Tailwind CSS
- **tailwind-merge** - Utilidad para combinar clases de Tailwind
- **class-variance-authority (CVA)** - Creación de variantes de componentes

### Componentes UI
- **shadcn/ui** - Colección de componentes reutilizables
- **Radix UI** - Primitivos de UI accesibles y sin estilos:
  - react-accordion
  - react-alert-dialog
  - react-aspect-ratio
  - react-avatar
  - react-checkbox
  - react-collapsible
  - react-context-menu
  - react-dialog
  - react-dropdown-menu
  - react-hover-card
  - react-label
  - react-menubar
  - react-navigation-menu
  - react-popover
  - react-progress
  - react-radio-group
  - react-scroll-area
  - react-select
  - react-separator
  - react-slider
  - react-slot
  - react-switch
  - react-tabs
  - react-toast
  - react-toggle
  - react-toggle-group
  - react-tooltip

### Componentes Adicionales
- **lucide-react** - Iconos SVG para React
- **cmdk** - Command palette/menu para React
- **sonner** - Biblioteca de notificaciones toast
- **vaul** - Componente drawer para React
- **input-otp** - Input para códigos OTP
- **embla-carousel-react** - Carrusel de imágenes

## Formularios y Validación
- **React Hook Form 7.60** - Manejo de formularios performante
- **Zod 3.25** - Validación de esquemas TypeScript-first
- **@hookform/resolvers** - Adaptadores de validación para React Hook Form

## Visualización de Datos
- **Recharts** - Biblioteca de gráficos para React
- **react-day-picker** - Selector de fechas
- **date-fns** - Utilidades para manipulación de fechas
- **react-resizable-panels** - Paneles redimensionables

## Utilidades
- **clsx** - Utilidad para construir strings de clases CSS condicionales
- **react-is** - Verificación de tipos de elementos React

## Analytics y Monitoreo
- **@vercel/analytics** - Analytics de Vercel para Next.js

## Herramientas de Desarrollo

### Linting y Formateo
- **ESLint 8** - Linter para identificar patrones problemáticos en código
- **eslint-config-next** - Configuración de ESLint para Next.js

### TypeScript
- **@types/node** - Definiciones de tipos para Node.js
- **@types/react** - Definiciones de tipos para React
- **@types/react-dom** - Definiciones de tipos para React DOM

## CI/CD y Deployment

### GitHub Actions
- **Workflows de CI/CD** configurados:
  - `ci.yml` - Integración continua (linting y build)
  - `deploy.yml` - Deployment automático
  - `main.yml` - Pipeline principal

### Plataformas de Deployment
- **Render** - Plataforma utilizada para el deployment actual
- Compatible también con: Vercel, Netlify, Railway, AWS Amplify

## Node.js
- **Versión requerida**: Node.js 18 o superior
- **Versión utilizada en CI/CD**: 22.16.0
- **Package Manager**: npm

## Configuración del Proyecto

### Archivos de Configuración
- `next.config.mjs` - Configuración de Next.js
- `tailwind.config.js` - Configuración de Tailwind CSS
- `postcss.config.mjs` - Configuración de PostCSS
- `tsconfig.json` - Configuración de TypeScript
- `package.json` - Dependencias y scripts

### Variables de Entorno
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

## Scripts NPM Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilación para producción
npm start        # Servidor de producción
npm run lint     # Ejecutar ESLint
```

## Arquitectura de Datos

### Base de Datos (PostgreSQL via Supabase)
Tablas principales:
- `profiles` - Perfiles de usuarios
- `surveys` - Encuestas
- `questions` - Preguntas de encuestas
- `responses` - Respuestas generales
- `answers` - Respuestas específicas

### Seguridad
- **Row Level Security (RLS)** - Políticas de seguridad a nivel de fila
- **Supabase Auth** - Sistema de autenticación completo
- Autenticación basada en email/password

## Funcionalidades Principales

### Tipos de Preguntas Soportadas
- Texto libre
- Opción múltiple
- Calificación/rating
- Sí/No (booleano)

### Características de la Aplicación
- Autenticación de usuarios
- Creación y gestión de encuestas
- Generación automática de códigos QR
- Visualización de resultados con gráficos
- Exportación de datos a CSV
- Diseño responsive
- Modo oscuro (dark mode)
- Protección con RLS en Supabase

## Navegadores Soportados
- Navegadores modernos que soporten ES2020
- Chrome, Firefox, Safari, Edge (últimas versiones)

## Sistema de Módulos
- **Tipo de módulos**: ES Modules (ESNext)
- **Resolución de módulos**: bundler
- **Alias de path**: `@/*` apunta a la raíz del proyecto

## Características de Next.js Utilizadas
- App Router (directorio `app/`)
- Server Components
- Client Components
- API Routes
- Middleware
- Image Optimization (deshabilitado con `unoptimized: true`)
- Ignorar errores de TypeScript en build (`ignoreBuildErrors: true`)

---

Última actualización: Diciembre 2025
