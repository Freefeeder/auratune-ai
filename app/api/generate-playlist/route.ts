import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { GoogleGenAI } from "@google/genai";

// Inicializa el cliente de Gemini de forma segura
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- JSON SCHEMA DEFINITIONS (Sin cambios) ---
const playlistSchema = z.object({
  name: z.string().describe("Un nombre creativo para la playlist basado en la emoción"),
  description: z.string().describe("Una breve descripción del ambiente de la playlist"),
  emotion_analysis: z.string().describe("Un análisis detallado del estado emocional del usuario"),
  music_preferences: z.object({
    genres: z.array(z.string()).describe("Géneros musicales recomendados"),
    energy_level: z.enum(["low", "medium", "high"]).describe("Nivel de energía de la música"),
    mood_keywords: z.array(z.string()).describe("Palabras clave que describen el ambiente deseado"),
    tempo: z.enum(["slow", "moderate", "fast"]).describe("Preferencia de tempo"),
  }),
  track_recommendations: z
    .array(
      z.object({
        query: z.string().describe("Consulta de búsqueda para encontrar este tipo de pista en Spotify"),
        reason: z.string().describe("Por qué esta pista se ajusta a la emoción"),
      }),
    )
    .length(15)
    .describe("15 consultas de búsqueda de pistas específicas"),
});

const geminiJsonSchema = {
    type: "object",
    properties: {
        name: { type: "string", description: "Un nombre creativo para la playlist basado en la emoción" },
        description: { type: "string", description: "Una breve descripción del ambiente de la playlist" },
        emotion_analysis: { type: "string", description: "Un análisis detallado del estado emocional del usuario" },
        music_preferences: {
            type: "object",
            properties: {
                genres: { type: "array", items: { type: "string" }, description: "Géneros musicales recomendados" },
                energy_level: { type: "string", enum: ["low", "medium", "high"], description: "Nivel de energía de la música" },
                mood_keywords: { type: "array", items: { type: "string" }, description: "Palabras clave que describen el ambiente deseado" },
                tempo: { type: "string", enum: ["slow", "moderate", "fast"], description: "Preferencia de tempo" },
            },
            required: ["genres", "energy_level", "mood_keywords", "tempo"]
        },
        track_recommendations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Consulta de búsqueda para encontrar este tipo de pista en Spotify" },
                    reason: { type: "string", description: "Por qué esta pista se ajusta a la emoción" },
                },
                required: ["query", "reason"]
            },
            description: "15 consultas de búsqueda de pistas específicas"
        }
    },
    required: ["name", "description", "emotion_analysis", "music_preferences", "track_recommendations"]
};

const languageInstructions = {
  es: { lang: "Spanish", instruction: "Responde en español." },
  en: { lang: "English", instruction: "Respond in English." },
  zh: { lang: "Chinese", instruction: "Responde en chino (simplificado)." },
};

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación y obtención del UID
    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const token = authorization.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid } = decodedToken;

    // 2. Comprobación de créditos en Firestore
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "Perfil de usuario no encontrado" }, { status: 404 });
    }
    const userData = userDoc.data();
    const subscription = userData?.subscription;

    if (!subscription) {
      return NextResponse.json({ error: "Datos de suscripción no encontrados" }, { status: 404 });
    }

    const isPremium = subscription.subscription_type === "premium";
    if (!isPremium && subscription.credits <= 0) {
      return NextResponse.json({ error: "No te quedan créditos. Actualiza a premium." }, { status: 403 });
    }

    // 3. Parseo de la solicitud
    const { emotion, playlistName, language = "es" } = await request.json();
    if (!emotion) {
      return NextResponse.json({ error: "La emoción es requerida" }, { status: 400 });
    }

    const langConfig = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.es;
    const promptText = `Eres un curador de música y experto en inteligencia emocional. ${langConfig.instruction} Estado emocional del usuario: "${emotion}". Genera una playlist.`;

    // 4. Llamada a la API de Gemini
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: geminiJsonSchema,
        },
    });
    
    const rawResponse = response.response;
    const jsonString = rawResponse.text();
    const rawAnalysis = JSON.parse(jsonString);
    const analysis = playlistSchema.parse(rawAnalysis);

    // 5. Actualización de la base de datos (créditos y log)
    const generationLogRef = adminDb.collection("playlist_generations").doc();

    const logPromise = generationLogRef.set({
      userId: uid,
      emotionInput: emotion,
      playlistName: playlistName || analysis.name,
      tracksCount: analysis.track_recommendations.length,
      language: language,
      createdAt: FieldValue.serverTimestamp(),
    });

    const creditUpdatePromise = !isPremium
      ? userRef.update({ "subscription.credits": FieldValue.increment(-1) })
      : Promise.resolve();

    await Promise.all([creditUpdatePromise, logPromise]);

    // 6. Devolver respuesta
    return NextResponse.json(analysis);

  } catch (error) {
    console.error("[API /generate-playlist] Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Respuesta inválida del modelo de IA" }, { status: 502 });
    }
    return NextResponse.json({ error: "No se pudo generar la playlist" }, { status: 500 });
  }
}
