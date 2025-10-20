# AuraTune AI - Playlists Emocionales con IA

AuraTune AI es una aplicación web que utiliza inteligencia artificial para crear playlists personalizadas de Spotify basadas en tus emociones. Simplemente describe cómo te sientes y nuestra IA generará la música perfecta para tu estado de ánimo.

## 🚀 Características

- ✅ **Autenticación con Supabase**: Sistema de registro e inicio de sesión con email y contraseña
- ✅ **Generación de Playlists con IA**: Utiliza GPT-4o-mini para analizar emociones y recomendar música
- ✅ **Integración con Spotify**: Guarda playlists directamente en tu cuenta de Spotify
- ✅ **Sistema de Créditos**: 2 créditos gratuitos iniciales, 1 crédito por generación
- ✅ **Multiidioma**: Soporte para Español, Inglés y Chino con detección automática
- ✅ **Base de Datos Supabase**: Perfiles de usuario, suscripciones e historial de playlists
- ✅ **Row Level Security (RLS)**: Seguridad de datos a nivel de fila

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase
- Cuenta de Spotify Developer
- Cuenta de Vercel (para despliegue)

## 🔧 Configuración Local

### 1. Clonar el Repositorio

\`\`\`bash
git clone <tu-repositorio>
cd auratune-ai
npm install
\`\`\`

### 2. Configurar Variables de Entorno

Crea un archivo \`.env.local\` en la raíz del proyecto:

\`\`\`bash
# Supabase
SUPABASE_URL=tu_supabase_project_url
SUPABASE_ANON_KEY=tu_supabase_anon_key

# Spotify API (para integración de música)
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret

# OpenAI API (para generación de playlists con IA)
OPENAI_API_KEY=tu_openai_api_key

# URL del sitio (para producción)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 3. Configurar Supabase

#### A. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Copia la URL del proyecto y la clave anónima (anon key)
3. Agrégalas a tu archivo \`.env.local\`

#### B. Ejecutar Scripts SQL

En el SQL Editor de Supabase, ejecuta los siguientes scripts en orden:

**Script 1: Crear Tablas** (\`scripts/001_create_profiles_and_subscriptions.sql\`)
- Crea las tablas \`profiles\`, \`subscriptions\` y \`playlist_generations\`
- Configura Row Level Security (RLS)
- Crea políticas de seguridad

**Script 2: Crear Triggers** (\`scripts/002_profile_and_subscription_triggers.sql\`)
- Crea función para auto-crear perfiles de usuario
- Configura triggers para nuevos usuarios
- Asigna 2 créditos gratuitos automáticamente

#### C. Configurar Autenticación

1. En Supabase Dashboard → Authentication → Settings
2. Habilita "Email" como proveedor de autenticación
3. Configura la URL de confirmación de email:
   - Site URL: \`http://localhost:3000\` (desarrollo) o tu dominio (producción)
   - Redirect URLs: \`http://localhost:3000/auth/callback\`

### 4. Configurar Spotify API

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación
3. Agrega las siguientes Redirect URIs:
   - \`http://localhost:3000/api/spotify/callback\` (desarrollo)
   - \`https://tu-dominio.com/api/spotify/callback\` (producción)
4. Copia el Client ID y Client Secret a tu \`.env.local\`

### 5. Configurar OpenAI API

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una API key
3. Agrégala a tu \`.env.local\`

### 6. Ejecutar en Desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en \`http://localhost:3000\`

## 🚀 Despliegue en Producción

### 1. Desplegar en Vercel

\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
\`\`\`

### 2. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, agrega todas las variables de entorno:

\`\`\`
SUPABASE_URL=tu_supabase_project_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret
OPENAI_API_KEY=tu_openai_api_key
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
\`\`\`

### 3. Actualizar URLs en Servicios Externos

#### Supabase:
- Site URL: \`https://tu-dominio.vercel.app\`
- Redirect URLs: \`https://tu-dominio.vercel.app/auth/callback\`

#### Spotify:
- Redirect URIs: \`https://tu-dominio.vercel.app/api/spotify/callback\`

## 📊 Estructura de Base de Datos

### Tabla: profiles
- \`id\` (uuid, PK) - Referencia a auth.users
- \`email\` (text)
- \`full_name\` (text)
- \`avatar_url\` (text)
- \`created_at\`, \`updated_at\` (timestamp)

### Tabla: subscriptions
- \`id\` (uuid, PK)
- \`user_id\` (uuid, FK → profiles)
- \`status\` (text) - 'active', 'inactive', 'trial'
- \`credits\` (integer) - Default: 2
- \`subscription_type\` (text) - 'free', 'premium'
- \`created_at\`, \`updated_at\` (timestamp)

### Tabla: playlist_generations
- \`id\` (uuid, PK)
- \`user_id\` (uuid, FK → profiles)
- \`emotion_input\` (text)
- \`playlist_name\` (text)
- \`tracks_count\` (integer)
- \`language\` (text) - 'es', 'en', 'zh'
- \`created_at\` (timestamp)

## 🎯 Flujo de Usuario

1. **Registro**: Usuario se registra con email y contraseña
2. **Verificación**: Recibe email de confirmación
3. **Login**: Inicia sesión en la aplicación
4. **Generación**: Describe su emoción y genera playlist (consume 1 crédito)
5. **Spotify**: Guarda la playlist en su cuenta de Spotify
6. **Créditos**: Puede generar 2 playlists gratis, luego necesita upgrade a premium

## 🔒 Seguridad

- **Row Level Security (RLS)**: Todos los datos están protegidos a nivel de fila
- **Autenticación Supabase**: Sistema de autenticación seguro y escalable
- **Variables de Entorno**: Todas las API keys están en el servidor, nunca expuestas al cliente
- **HTTPS**: Todas las comunicaciones están encriptadas en producción

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Autenticación**: Supabase Auth
- **Base de Datos**: Supabase (PostgreSQL)
- **IA**: OpenAI GPT-4o-mini
- **Música**: Spotify Web API
- **Estilos**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Despliegue**: Vercel

## 📝 Scripts Disponibles

\`\`\`bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en producción
npm run lint         # Ejecutar linter
\`\`\`

## 🐛 Troubleshooting

### Error: "Unauthorized" al generar playlist
- Verifica que el usuario esté autenticado
- Revisa que las políticas RLS estén activas en Supabase

### Error: "No credits remaining"
- Usuario sin créditos y no premium
- Verifica la tabla subscriptions en Supabase

### Error: Variables de entorno
- Verifica que todas las variables estén configuradas
- Redeploy después de agregar variables en Vercel

### Error: Spotify API
- Verifica que las Redirect URIs estén correctamente configuradas
- Asegúrate de que el Client ID y Secret sean correctos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📧 Contacto

Para soporte o preguntas, contacta a: [tu-email@ejemplo.com]

---

**AuraTune AI** - Música que entiende tus emociones 🎵✨
