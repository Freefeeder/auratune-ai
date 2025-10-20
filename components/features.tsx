"use client"

import { Brain, Music, Zap, Heart, Sparkles, ListMusic } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

export function Features() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Brain,
      titleKey: "features.ai.title",
      descriptionKey: "features.ai.description",
    },
    {
      icon: Music,
      titleKey: "features.spotify.title",
      descriptionKey: "features.spotify.description",
    },
    {
      icon: Zap,
      titleKey: "features.instant.title",
      descriptionKey: "features.instant.description",
    },
    {
      icon: Heart,
      titleKey: "features.personalization.title",
      descriptionKey: "features.personalization.description",
    },
    {
      icon: Sparkles,
      titleKey: "features.discover.title",
      descriptionKey: "features.discover.description",
    },
    {
      icon: ListMusic,
      titleKey: "features.history.title",
      descriptionKey: "features.history.description",
    },
  ]

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t("features.title")}</h2>
          <p className="text-pretty text-lg text-muted-foreground">{t("features.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t(feature.titleKey)}</h3>
                <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
