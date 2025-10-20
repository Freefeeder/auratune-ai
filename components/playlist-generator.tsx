'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sparkles, Music2, Loader2 } from "lucide-react"
import { PlaylistResult } from "@/components/playlist-result"
import { useLanguage } from "@/lib/language-context"
import { detectLanguage } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context" // Importamos el hook de autenticación

export function PlaylistGenerator() {
  const { t, setLocale } = useLanguage()
  const { user } = useAuth() // Obtenemos el usuario de Firebase
  const [emotion, setEmotion] = useState("")
  const [playlistName, setPlaylistName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [playlist, setPlaylist] = useState<any>(null)

  // Un usuario puede generar si está logueado y no hay una generación en curso.
  const canGenerate = !!user && !isGenerating

  const handleGenerate = async () => {
    if (!emotion.trim() || !canGenerate || !user) return

    const detectedLocale = detectLanguage(emotion.trim())
    setLocale(detectedLocale)

    setIsGenerating(true)
    setPlaylist(null)

    try {
      // Obtenemos el token de ID de Firebase del usuario.
      const token = await user.getIdToken()

      // Preparamos los headers con el token de autorización.
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      // Paso 1: Analizar emoción y obtener recomendaciones
      const analysisResponse = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: headers, // Usamos los nuevos headers
        body: JSON.stringify({
          emotion: emotion.trim(),
          playlistName: playlistName.trim() || undefined,
          language: detectedLocale,
        }),
      })

      if (!analysisResponse.ok) {
        const error = await analysisResponse.json()
        throw new Error(error.error || "Fallo al analizar la emoción")
      }

      const analysis = await analysisResponse.json()

      // Paso 2: Buscar las pistas en Spotify
      const searchResponse = await fetch("/api/search-tracks", {
        method: "POST",
        headers: headers, // Usamos los nuevos headers también aquí
        body: JSON.stringify({
          queries: analysis.track_recommendations.map((rec: any) => rec.query),
        }),
      })

      if (!searchResponse.ok) throw new Error("Fallo al buscar las pistas")

      const { tracks } = await searchResponse.json()

      // Combinar análisis con las pistas reales
      setPlaylist({
        name: analysis.name,
        description: analysis.description,
        emotion_analysis: analysis.emotion_analysis,
        tracks: tracks,
      })

    } catch (error) {
      console.error("[PlaylistGenerator] Error:", error)
      alert(error instanceof Error ? error.message : t("generator.error"))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t("generator.title")}
              </CardTitle>
              <CardDescription>{t("generator.description")}</CardDescription>
            </div>
            {/* La lógica de créditos se ha eliminado temporalmente */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emotion">{t("generator.emotionLabel")}</Label>
            <Textarea
              id="emotion"
              placeholder={t("generator.emotionPlaceholder")}
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={!canGenerate}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playlistName">{t("generator.nameLabel")}</Label>
            <Input
              id="playlistName"
              placeholder={t("generator.namePlaceholder")}
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              disabled={!canGenerate}
            />
          </div>

          <Button onClick={handleGenerate} disabled={!emotion.trim() || !canGenerate} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("generator.generating")}
              </>
            ) : (
              <>
                <Music2 className="mr-2 h-4 w-4" />
                {t("generator.generate")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {playlist && <PlaylistResult playlist={playlist} />}
    </div>
  )
}
