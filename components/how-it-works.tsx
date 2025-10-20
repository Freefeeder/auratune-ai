"use client"

import { MessageSquare, Sparkles, Music2, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      titleKey: "howItWorks.step1.title",
      descriptionKey: "howItWorks.step1.description",
    },
    {
      number: "02",
      icon: Sparkles,
      titleKey: "howItWorks.step2.title",
      descriptionKey: "howItWorks.step2.description",
    },
    {
      number: "03",
      icon: Music2,
      titleKey: "howItWorks.step3.title",
      descriptionKey: "howItWorks.step3.description",
    },
    {
      number: "04",
      icon: Check,
      titleKey: "howItWorks.step4.title",
      descriptionKey: "howItWorks.step4.description",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t("howItWorks.title")}</h2>
          <p className="text-pretty text-lg text-muted-foreground">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                </div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t(step.titleKey)}</h3>
                <p className="text-muted-foreground">{t(step.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
