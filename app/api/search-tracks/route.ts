import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { searchSpotifyTrack } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación con Firebase Admin
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado: Falta el token" }, { status: 401 });
    }
    const token = authorization.split("Bearer ")[1];

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      console.log(`Usuario autenticado con éxito para buscar pistas: ${decodedToken.uid}`);
    } catch (error) {
      console.error("Error de autenticación de Firebase:", error);
      return NextResponse.json({ error: "No autorizado: Token inválido" }, { status: 401 });
    }

    // 2. Parsear el cuerpo de la solicitud (sin cambios)
    const { queries } = await request.json();

    if (!Array.isArray(queries)) {
      return NextResponse.json({ error: "Las consultas deben ser un array" }, { status: 400 });
    }

    // 3. Obtener el token de acceso de Spotify (sin cambios)
    const spotifyToken = await getSpotifyAccessToken();

    if (!spotifyToken) {
      return NextResponse.json({ error: "Fallo al autenticar con Spotify" }, { status: 500 });
    }

    // 4. Buscar las pistas en paralelo (sin cambios)
    const trackPromises = queries.map((query: string) => searchSpotifyTrack(query, spotifyToken));
    const tracks = await Promise.all(trackPromises);

    // Filtrar resultados nulos
    const validTracks = tracks.filter((track) => track !== null);

    return NextResponse.json({ tracks: validTracks });

  } catch (error) {
    console.error("[API /search-tracks] Error:", error);
    return NextResponse.json({ error: "Fallo al buscar las pistas" }, { status: 500 });
  }
}

// Esta función permanece igual, ya que utiliza credenciales de cliente de la aplicación.
async function getSpotifyAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
      cache: "no-cache", // Es importante no cachear esta solicitud de token
    });

    if (!response.ok) {
      console.error("Error al obtener el token de Spotify:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Excepción al obtener el token de Spotify:", error);
    return null;
  }
}
