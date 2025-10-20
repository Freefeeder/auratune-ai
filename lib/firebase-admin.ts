import * as admin from 'firebase-admin';

// Este es el formato de las credenciales de la cuenta de servicio de Firebase.
// Las variables de entorno deben estar configuradas en tu entorno de despliegue.
const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // La clave privada a menudo viene con caracteres de nueva línea (\n).
  // Necesitamos reemplazarlos para que sea leída correctamente.
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Verificamos si la app de Firebase ya ha sido inicializada.
// Esto previene errores de reinicialización durante el hot-reloading en desarrollo.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin initialization error', error.stack);
  }
}

// Exportamos los servicios de admin que vamos a necesitar en nuestra aplicación.
// Por ahora, solo necesitamos el servicio de autenticación.
export const adminAuth = admin.auth();
