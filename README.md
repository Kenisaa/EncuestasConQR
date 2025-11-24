# Sistema de Encuestas QR

Sistema de encuestas con códigos QR construido con **Next.js 15** (App Router) y Supabase.

## Características

- ✅ Autenticación de usuarios (registro/login con Supabase Auth)
- ✅ Creación de encuestas personalizadas
- ✅ Generación de códigos QR únicos por encuesta
- ✅ Múltiples tipos de preguntas (texto, opción múltiple, calificación, sí/no)
- ✅ Visualización de resultados con gráficos interactivos
- ✅ Exportación de datos a CSV
- ✅ Diseño responsive con Tailwind CSS
- ✅ Componentes UI con shadcn/ui y Radix UI
- ✅ Row Level Security (RLS) en Supabase

## Tecnologías

- **Next.js 15** - Framework React con App Router
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 3** - Estilos utility-first
- **Supabase** - Base de datos PostgreSQL y autenticación
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos y visualizaciones
- **QRCode** - Generación de códigos QR

## Estructura del Proyecto

```
EncuestasQR/
├── app/                      # App Router de Next.js
│   ├── api/                  # API Routes
│   │   └── auth/logout/      # Endpoint de logout
│   ├── dashboard/            # Dashboard protegido
│   │   ├── page.tsx          # Lista de encuestas
│   │   └── encuestas/
│   │       ├── nueva/        # Crear encuesta
│   │       └── [id]/         # Detalle y resultados
│   ├── encuesta/[id]/        # Vista pública de encuesta
│   ├── login/                # Página de login
│   ├── registro/             # Página de registro
│   └── layout.tsx            # Layout principal
├── components/               # Componentes React
│   ├── ui/                   # Componentes UI (shadcn)
│   ├── new-survey-form.tsx   # Formulario de nueva encuesta
│   ├── survey-list.tsx       # Lista de encuestas
│   ├── qr-code-display.tsx   # Mostrar QR
│   └── results-charts.tsx    # Gráficos de resultados
├── lib/                      # Utilidades
│   ├── supabase/
│   │   ├── client.ts         # Cliente Supabase (browser)
│   │   └── server.ts         # Cliente Supabase (server)
│   └── utils.ts              # Utilidades generales
├── scripts/                  # Scripts SQL
│   └── 001_create_tables.sql # Schema de la base de datos
└── public/                   # Archivos estáticos
```

## Requisitos Previos

- Node.js 18 o superior
- npm, yarn o pnpm
- Cuenta en [Supabase](https://supabase.com)

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd EncuestasQR
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

Sigue la guía detallada en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) o sigue estos pasos rápidos:

#### 3.1 Crear proyecto en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto
3. Ve a **Settings** → **API**
4. Copia la **Project URL** y la **anon/public key**

#### 3.2 Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**IMPORTANTE:** En Next.js, las variables expuestas al cliente deben tener el prefijo `NEXT_PUBLIC_`

#### 3.3 Ejecutar el script SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido de `scripts/001_create_tables.sql`
4. Ejecuta el script (Run)

Esto creará:
- Tablas: `profiles`, `surveys`, `questions`, `responses`, `answers`
- Políticas de seguridad (Row Level Security)
- Trigger para crear perfiles automáticamente
- Índices para mejor rendimiento

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 5. Compilar para producción

```bash
npm run build
npm start
```

## Uso

### 1. Registro e Inicio de Sesión

1. Ve a `/registro` para crear una cuenta
2. Confirma tu email (si está habilitado en Supabase)
3. Inicia sesión en `/login`

### 2. Crear una Encuesta

1. Ve al dashboard
2. Haz clic en "Nueva Encuesta"
3. Completa el título y descripción
4. Agrega preguntas (texto, opción múltiple, calificación, sí/no)
5. Guarda la encuesta

### 3. Compartir Encuesta

1. En la lista de encuestas, haz clic en "Ver Detalles"
2. Verás el código QR generado automáticamente
3. Comparte el QR o la URL directa

### 4. Ver Resultados

1. Desde el dashboard, haz clic en "Ver Resultados"
2. Visualiza gráficos interactivos de las respuestas
3. Exporta los datos a CSV si lo necesitas

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter de ESLint

## Configuración de Supabase

### Base de Datos

El schema incluye:

**profiles**
- Perfil de usuario (id, email, nombre)

**surveys**
- Encuestas (id, user_id, titulo, descripcion, activa)

**questions**
- Preguntas (id, survey_id, pregunta, tipo, opciones, orden)

**responses**
- Respuestas generales (id, survey_id, respondente_nombre, respondente_email)

**answers**
- Respuestas específicas (id, response_id, question_id, respuesta)

### Row Level Security (RLS)

El sistema implementa políticas de seguridad:
- Los usuarios solo ven sus propias encuestas
- Cualquiera puede responder encuestas activas (anónimamente)
- Los dueños ven todas las respuestas de sus encuestas
- Los perfiles son privados

## Deployment

### Vercel (Recomendado)

1. Sube el proyecto a GitHub
2. Importa el repositorio en [Vercel](https://vercel.com)
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (tu URL de Vercel)
4. Deploy automático

### Otros Servicios

El proyecto es compatible con cualquier servicio que soporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno tengan el prefijo `NEXT_PUBLIC_`
- Asegúrate de usar la **anon/public key** (no la service_role)
- Reinicia el servidor después de cambiar `.env.local`

### Error: "relation does not exist"
- Las tablas no se crearon correctamente
- Ejecuta nuevamente el script SQL en Supabase

### No puedo crear encuestas
- Verifica que las políticas RLS estén activas
- Revisa la consola del navegador para errores
- Asegúrate de estar autenticado

Para más detalles, consulta:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Guía completa de Supabase
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solución de problemas comunes

## Documentación Adicional

- [COMO_USAR.md](./COMO_USAR.md) - Guía de uso
- [INSTRUCCIONES_SETUP.md](./INSTRUCCIONES_SETUP.md) - Setup detallado
- [SETUP_RAPIDO.md](./SETUP_RAPIDO.md) - Setup rápido

## Licencia

[Especifica tu licencia aquí]

---

Desarrollado con Next.js 15 y Supabase
