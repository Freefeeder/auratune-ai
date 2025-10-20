'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, ExternalLink, Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context" // Importamos el hook de autenticación

interface Track {
  name: string
  artist: string
  album: string
  uri: string
  preview_url?: string
}

interface PlaylistResultProps {
  playlist: {
    name: string
    description: string
    tracks: Track[]
    emotion_analysis: string
  }
}

export function PlaylistResult({ playlist }: PlaylistResultProps) {
  const { t } = useLanguage()
  const { user } = useAuth() // Obtenemos el usuario de Firebase
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveToSpotify = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar una playlist.")
      return
    }

    setIsSaving(true)
    try {
      const token = await user.getIdToken() // Obtenemos el token de Firebase

      const response = await fetch("/api/save-to-spotify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadimos el token a la cabecera
        },
        body: JSON.stringify(playlist),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Fallo al guardar la playlist")
      }

      const data = await response.json()
      setSaved(true)
      console.log("Respuesta de guardado (simulada):", data)

      alert(t("result.success"))

    } catch (error) {
      console.error("Error guardando la playlist:", error)
      alert(error instanceof Error ? error.message : t("result.error"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              {playlist.name}
            </CardTitle>
            <CardDescription className="mt-2">{playlist.description}</CardDescription>
          </div>
          <Button onClick={handleSaveToSpotify} disabled={isSaving || saved || !user} size="sm">
            {saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                ¡Guardada!
              </>
            ) : isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("result.saving")}
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("result.save")}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="mb-2 text-sm font-semibold">{t("result.emotionAnalysis")}</h3>
          <p className="text-sm text-muted-foreground">{playlist.emotion_analysis}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">
            {playlist.tracks.length} {t("result.tracks")}
          </h3>
          <div className="space-y-2">
            {playlist.tracks.map((track, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{track.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
