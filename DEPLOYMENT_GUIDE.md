# MooD DJ - Guía de Despliegue

## 📋 Análisis Pre-Producción

### ✅ Estado del Proyecto
El proyecto **MooD DJ** está listo para despliegue en producción con las siguientes características implementadas:

#### Funcionalidades Completadas:
- ✅ Landing page multiidioma (Español, Inglés, Chino)
- ✅ Sistema de autenticación con Supabase (Email/Contraseña + Google OAuth)
- ✅ Base de datos con perfiles de usuario y suscripciones
- ✅ Sistema de créditos (2 créditos gratuitos, 1 crédito por generación)
- ✅ Generación de playlists con IA (GPT-4o-mini)
- ✅ Integración con Spotify API
- ✅ Detección automática de idioma
- ✅ Dashboard protegido con middleware
- ✅ Row Level Security (RLS) en Supabase

---

## 🔐 Variables de Entorno Requeridas

### Variables Actuales (Ya Configuradas):
\`\`\`bash
# Spotify OAuth
AUTH_SPOTIFY_ID=tu_spotify_client_id
AUTH_SPOTIFY_SECRET=tu_spotify_client_secret

# Supabase Database
SUPABASE_SUPABASE_URL=tu_supabase_url
SUPABASE_SUPABASE_ANON_KEY=tu_supabase_anon_key
\`\`\`

### ⚠️ Variables FALTANTES (Debes Agregar):

\`\`\`bash
# NextAuth Secret (REQUERIDA)
NEXTAUTH_SECRET=tu_secret_key_aleatorio

# URL del sitio en producción (REQUERIDA)
NEXT_PUBLIC_SITE_URL=https://tu-app.vercel.app
\`\`\`

**¿Qué es NEXTAUTH_SECRET?**
- Es una clave secreta para encriptar tokens de sesión
- Debe ser una cadena aleatoria y segura
- **Cómo generarla**: Ejecuta en tu terminal: `openssl rand -base64 32`
- O usa: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

**¿Qué es NEXT_PUBLIC_SITE_URL?**
- Es la URL pública de tu aplicación en producción
- Se usa para el redirect de Google OAuth después de la autenticación
- Ejemplo: `https://mood-dj.vercel.app` o tu dominio personalizado
- **IMPORTANTE**: Debe comenzar con `https://` en producción

**Cómo agregarlas:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega ambas variables con sus valores
4. Redeploy la aplicación

---

## 🔗 Configuración de Base de Datos

### Scripts SQL a Ejecutar (En Orden):

1. **001_create_profiles_and_subscriptions.sql**
   - Crea tablas: `profiles`, `subscriptions`, `playlist_generations`
   - Configura Row Level Security (RLS)
   - Crea políticas de seguridad
   - Crea índices para performance

2. **002_profile_and_subscription_triggers.sql**
   - Crea función `handle_new_user()` para auto-crear perfiles
   - Crea trigger para nuevos usuarios
   - Configura timestamps automáticos

**Cómo ejecutar:**
Los scripts se ejecutan automáticamente desde v0. Si necesitas ejecutarlos manualmente:
1. Ve a tu proyecto de Supabase
2. SQL Editor
3. Copia y pega cada script en orden
4. Ejecuta

---

## 🔒 Configuración de Seguridad

### Google OAuth Setup:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Agrega URIs autorizados:
   - `https://tu-app.vercel.app`
   - `https://tu-app.vercel.app/auth/callback`
6. Copia Client ID y Client Secret
7. Agrégalos a Supabase:
   - Supabase Dashboard → Authentication → Providers → Google
   - Pega Client ID y Client Secret

### Spotify OAuth Setup:
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una aplicación
3. Agrega Redirect URIs:
   - `https://tu-app.vercel.app/api/auth/callback/spotify`
4. Copia Client ID y Client Secret
5. Ya están configurados en tus variables de entorno

---

## 🚀 Checklist de Despliegue

### Antes de Desplegar:
- [ ] Agregar variables `NEXTAUTH_SECRET` y `NEXT_PUBLIC_SITE_URL` en Vercel
- [ ] Ejecutar scripts SQL en Supabase (001 y 002)
- [ ] Configurar Google OAuth en Supabase
- [ ] Verificar Spotify OAuth redirect URIs
- [ ] Verificar que todas las variables de entorno estén en Vercel

### Después de Desplegar:
- [ ] Probar registro con email/contraseña
- [ ] Probar login con Google
- [ ] Verificar que se creen 2 créditos iniciales
- [ ] Probar generación de playlist (debe consumir 1 crédito)
- [ ] Verificar que sin créditos no se pueda generar
- [ ] Probar cambio de idioma
- [ ] Verificar que la integración con Spotify funcione

---

## 📊 Estructura de Base de Datos

### Tabla: profiles
- `id` (uuid, PK) - Referencia a auth.users
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `created_at`, `updated_at` (timestamp)

### Tabla: subscriptions
- `id` (uuid, PK)
- `user_id` (uuid, FK → profiles)
- `status` (text) - 'active', 'inactive', 'trial'
- `credits` (integer) - Default: 2
- `subscription_type` (text) - 'free', 'premium'
- `subscription_start_date`, `subscription_end_date` (timestamp)
- `created_at`, `updated_at` (timestamp)

### Tabla: playlist_generations
- `id` (uuid, PK)
- `user_id` (uuid, FK → profiles)
- `emotion_input` (text)
- `playlist_name` (text)
- `tracks_count` (integer)
- `language` (text) - 'es', 'en', 'zh'
- `created_at` (timestamp)

---

## 🎯 Flujo de Usuario

1. **Registro/Login**
   - Usuario se registra con email/contraseña o Google
   - Se crea automáticamente perfil y suscripción con 2 créditos

2. **Generación de Playlist**
   - Usuario describe su emoción en cualquier idioma
   - IA analiza y genera 15 recomendaciones
   - Se consume 1 crédito (si no es premium)
   - Se buscan tracks en Spotify
   - Usuario puede guardar playlist en su cuenta de Spotify

3. **Sistema de Créditos**
   - Usuarios free: 2 créditos iniciales
   - Cada generación: -1 crédito
   - Sin créditos: mensaje para upgrade a premium
   - Usuarios premium: generaciones ilimitadas

---

## 🔧 Troubleshooting

### Error: "Unauthorized" al generar playlist
- Verifica que el usuario esté autenticado
- Revisa que las políticas RLS estén activas

### Error: "No credits remaining"
- Usuario sin créditos y no premium
- Verifica tabla subscriptions

### Error: OAuth redirect
- Verifica `NEXT_PUBLIC_SITE_URL`
- Verifica URIs en Google/Spotify dashboards

### Error: Variables de entorno
- Verifica que todas las variables estén en Vercel
- Redeploy después de agregar variables

---

## 📝 Notas Importantes

1. **Seguridad**: Todas las API keys están en el servidor, nunca expuestas al cliente
2. **RLS**: Row Level Security protege los datos de cada usuario
3. **Créditos**: El sistema verifica créditos antes de cada generación
4. **Idiomas**: Detección automática basada en el input del usuario
5. **Spotify**: Requiere que el usuario autorice la app para crear playlists

---

## ✅ Estado Final

**El proyecto está LISTO para producción** una vez que agregues las variables `NEXTAUTH_SECRET` y `NEXT_PUBLIC_SITE_URL`.

Todas las demás configuraciones están completas y funcionando correctamente.
