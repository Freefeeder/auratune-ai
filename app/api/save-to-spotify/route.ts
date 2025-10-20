import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación con Firebase Admin
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado: Falta el token" }, { status: 401 });
    }
    const token = authorization.split("Bearer ")[1];
    let uid: string;

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      uid = decodedToken.uid;
      console.log(`Usuario autenticado con éxito para guardar en Spotify: ${uid}`);
    } catch (error) {
      console.error("Error de autenticación de Firebase:", error);
      return NextResponse.json({ error: "No autorizado: Token inválido" }, { status: 401 });
    }

    // 2. Parsear el cuerpo de la solicitud
    const { name, description, tracks } = await request.json();

    if (!name || !Array.isArray(tracks)) {
      return NextResponse.json({ error: "Datos de la playlist inválidos" }, { status: 400 });
    }

    // 3. [LÓGICA DE SPOTIFY DESACTIVADA TEMPORALMENTE]
    // TODO: Implementar el flujo OAuth2 de Spotify para obtener un token de acceso
    // y luego usar la API de Spotify para crear la playlist y añadir las pistas.
    console.log(`[SAVE-TO-SPOTIFY] El usuario ${uid} intentó guardar la playlist "${name}". La funcionalidad real de Spotify está pendiente.`);

    // 4. Devolver una respuesta simulada exitosa
    // Esta respuesta permite al frontend confirmar que el proceso "funcionó"
    // mientras la integración real está en desarrollo.
    return NextResponse.json({
      success: true,
      message: "La playlist fue procesada exitosamente (simulado)",
      note: "Para guardar en Spotify, necesitas conectar tu cuenta. Esta función se implementará pronto.",
      playlist: {
        name,
        description,
        tracks,
      },
    });

  } catch (error) {
    console.error("[API /save-to-spotify] Error:", error);
    return NextResponse.json({ error: "No se pudo procesar la playlist" }, { status: 500 });
  }
}
