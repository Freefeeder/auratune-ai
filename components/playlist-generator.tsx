"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sparkles, Music2, Loader2, Coins } from "lucide-react"
import { PlaylistResult } from "@/components/playlist-result"
import { useLanguage } from "@/lib/language-context"
import { detectLanguage } from "@/lib/i18n"
import { useRouter } from "next/navigation"

interface PlaylistGeneratorProps {
  subscription: {
    credits: number
    subscription_type: string
    status: string
  } | null
}

export function PlaylistGenerator({ subscription }: PlaylistGeneratorProps) {
  const { t, setLocale } = useLanguage()
  const router = useRouter()
  const [emotion, setEmotion] = useState("")
  const [playlistName, setPlaylistName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [playlist, setPlaylist] = useState<any>(null)

  const canGenerate =
    subscription && (subscription.subscription_type === "premium" || subscription.credits > 0) && !isGenerating

  const handleGenerate = async () => {
    if (!emotion.trim() || !canGenerate) return

    const detectedLocale = detectLanguage(emotion.trim())
    setLocale(detectedLocale)

    setIsGenerating(true)
    setPlaylist(null)

    try {
      // Step 1: Analyze emotion and get recommendations
      const analysisResponse = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion: emotion.trim(),
          playlistName: playlistName.trim() || undefined,
          language: detectedLocale,
        }),
      })

      if (!analysisResponse.ok) {
        const error = await analysisResponse.json()
        throw new Error(error.error || "Failed to analyze emotion")
      }

      const analysis = await analysisResponse.json()

      // Step 2: Search for actual tracks on Spotify
      const searchResponse = await fetch("/api/search-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queries: analysis.track_recommendations.map((rec: any) => rec.query),
        }),
      })

      if (!searchResponse.ok) throw new Error("Failed to search tracks")

      const { tracks } = await searchResponse.json()

      // Combine analysis with actual tracks
      setPlaylist({
        name: analysis.name,
        description: analysis.description,
        emotion_analysis: analysis.emotion_analysis,
        tracks: tracks,
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Error generating playlist:", error)
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
            {subscription && subscription.subscription_type !== "premium" && (
              <div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {subscription.credits} {t("subscription.creditsRemaining")}
                </span>
              </div>
            )}
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
