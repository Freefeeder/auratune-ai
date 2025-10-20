# 🚀 Guía de Configuración - AuraTune AI

Esta guía te llevará paso a paso para configurar y desplegar AuraTune AI desde cero.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Configuración de Spotify](#configuración-de-spotify)
4. [Configuración de OpenAI](#configuración-de-openai)
5. [Configuración Local](#configuración-local)
6. [Despliegue en Vercel](#despliegue-en-vercel)
7. [Verificación Final](#verificación-final)

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Node.js 18 o superior instalado
- ✅ Una cuenta de GitHub
- ✅ Una cuenta de Vercel (gratis)
- ✅ Una cuenta de Supabase (gratis)
- ✅ Una cuenta de Spotify Developer (gratis)
- ✅ Una cuenta de OpenAI con créditos API

---

## 2. Configuración de Supabase

### Paso 2.1: Crear Proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una nueva organización (si no tienes una)
4. Crea un nuevo proyecto:
   - **Name**: AuraTune AI
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Selecciona la más cercana a tus usuarios
   - **Pricing Plan**: Free (suficiente para empezar)
5. Espera 2-3 minutos mientras se crea el proyecto

### Paso 2.2: Obtener Credenciales

1. En el dashboard de tu proyecto, ve a **Settings** → **API**
2. Copia y guarda:
   - **Project URL** (ejemplo: \`https://xxxxx.supabase.co\`)
   - **anon public** key (la clave que dice "anon" "public")

### Paso 2.3: Configurar Autenticación

1. Ve a **Authentication** → **Providers**
2. Asegúrate de que **Email** esté habilitado
3. Ve a **Authentication** → **URL Configuration**
4. Configura:
   - **Site URL**: \`http://localhost:3000\` (por ahora, lo cambiaremos después)
   - **Redirect URLs**: Agrega \`http://localhost:3000/auth/callback\`

### Paso 2.4: Ejecutar Scripts SQL

1. Ve a **SQL Editor** en el menú lateral
2. Haz clic en **New query**
3. Copia y pega el contenido de \`scripts/001_create_profiles_and_subscriptions.sql\`
4. Haz clic en **Run** (esquina inferior derecha)
5. Espera a que termine (verás "Success. No rows returned")
6. Repite el proceso con \`scripts/002_profile_and_subscription_triggers.sql\`

### Paso 2.5: Verificar Tablas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver 3 tablas:
   - \`profiles\`
   - \`subscriptions\`
   - \`playlist_generations\`

---

## 3. Configuración de Spotify

### Paso 3.1: Crear Aplicación

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en **Create app**
4. Completa el formulario:
   - **App name**: AuraTune AI
   - **App description**: AI-powered emotional playlist generator
   - **Redirect URIs**: \`http://localhost:3000/api/spotify/callback\`
   - **Which API/SDKs are you planning to use?**: Web API
5. Acepta los términos y haz clic en **Save**

### Paso 3.2: Obtener Credenciales

1. En la página de tu aplicación, haz clic en **Settings**
2. Copia y guarda:
   - **Client ID**
   - **Client Secret** (haz clic en "View client secret")

---

## 4. Configuración de OpenAI

### Paso 4.1: Crear API Key

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Inicia sesión o crea una cuenta
3. Ve a **API keys** en el menú lateral
4. Haz clic en **Create new secret key**
5. Dale un nombre: "AuraTune AI"
6. Copia y guarda la clave (solo se muestra una vez)

### Paso 4.2: Agregar Créditos

1. Ve a **Billing** → **Payment methods**
2. Agrega un método de pago
3. Agrega al menos $5 USD de créditos

---

## 5. Configuración Local

### Paso 5.1: Clonar el Repositorio

\`\`\`bash
git clone <tu-repositorio>
cd auratune-ai
npm install
\`\`\`

### Paso 5.2: Crear Archivo de Variables de Entorno

Crea un archivo \`.env.local\` en la raíz del proyecto:

\`\`\`bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=tu_supabase_anon_key

# Spotify
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

**Reemplaza** todos los valores con tus credenciales reales.

### Paso 5.3: Ejecutar en Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Paso 5.4: Probar Registro

1. Haz clic en "Registrarse"
2. Completa el formulario con:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
3. Haz clic en "Registrarse"
4. Revisa tu email para el enlace de verificación
5. Haz clic en el enlace para activar tu cuenta
6. Inicia sesión

---

## 6. Despliegue en Vercel

### Paso 6.1: Conectar con GitHub

1. Sube tu código a GitHub:
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### Paso 6.2: Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **Add New** → **Project**
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: \`npm run build\`
   - **Output Directory**: .next

### Paso 6.3: Agregar Variables de Entorno

En la sección **Environment Variables**, agrega:

\`\`\`
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=tu_supabase_anon_key
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret
OPENAI_API_KEY=sk-xxxxx
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
\`\`\`

**Nota**: Deja \`NEXT_PUBLIC_SITE_URL\` vacío por ahora, lo actualizaremos después del despliegue.

### Paso 6.4: Desplegar

1. Haz clic en **Deploy**
2. Espera 2-3 minutos
3. Una vez completado, copia la URL de tu proyecto (ejemplo: \`https://auratune-ai.vercel.app\`)

### Paso 6.5: Actualizar Variables de Entorno

1. Ve a **Settings** → **Environment Variables**
2. Edita \`NEXT_PUBLIC_SITE_URL\` y pega tu URL de Vercel
3. Haz clic en **Save**
4. Ve a **Deployments** y haz clic en **Redeploy** en el último despliegue

---

## 7. Actualizar URLs en Servicios Externos

### Paso 7.1: Actualizar Supabase

1. Ve a tu proyecto en Supabase
2. **Authentication** → **URL Configuration**
3. Actualiza:
   - **Site URL**: \`https://tu-proyecto.vercel.app\`
   - **Redirect URLs**: Agrega \`https://tu-proyecto.vercel.app/auth/callback\`

### Paso 7.2: Actualizar Spotify

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Selecciona tu aplicación
3. Haz clic en **Settings**
4. En **Redirect URIs**, agrega:
   - \`https://tu-proyecto.vercel.app/api/spotify/callback\`
5. Haz clic en **Save**

---

## 8. Verificación Final

### Checklist de Verificación

- [ ] ✅ Puedes acceder a tu sitio en la URL de Vercel
- [ ] ✅ Puedes registrarte con email y contraseña
- [ ] ✅ Recibes el email de verificación
- [ ] ✅ Puedes iniciar sesión después de verificar
- [ ] ✅ Ves el dashboard con 2 créditos
- [ ] ✅ Puedes generar una playlist (consume 1 crédito)
- [ ] ✅ La playlist se muestra correctamente
- [ ] ✅ Puedes guardar la playlist en Spotify (si conectas tu cuenta)

### Prueba Completa

1. **Registro**:
   - Ve a tu sitio
   - Haz clic en "Registrarse"
   - Completa el formulario
   - Verifica tu email

2. **Login**:
   - Inicia sesión con tus credenciales

3. **Generar Playlist**:
   - Describe tu emoción (ejemplo: "Me siento feliz y con energía")
   - Haz clic en "Generar Playlist"
   - Espera 10-15 segundos
   - Verifica que se muestren las canciones

4. **Verificar Créditos**:
   - Deberías tener 1 crédito restante
   - Genera otra playlist
   - Deberías tener 0 créditos
   - Intenta generar otra (debería mostrar mensaje de upgrade)

---

## 🎉 ¡Felicidades!

Tu aplicación AuraTune AI está completamente configurada y funcionando en producción.

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa los logs en Vercel: **Deployments** → Selecciona tu despliegue → **Function Logs**
2. Revisa los logs en Supabase: **Logs** → **Postgres Logs**
3. Verifica que todas las variables de entorno estén correctas
4. Asegúrate de que las URLs de redirect estén actualizadas en todos los servicios

## 📚 Próximos Pasos

- Configura un dominio personalizado en Vercel
- Implementa sistema de pagos con Stripe para suscripciones premium
- Agrega más idiomas
- Implementa historial de playlists
- Agrega análisis con Vercel Analytics

---

**AuraTune AI** - Música que entiende tus emociones 🎵✨
