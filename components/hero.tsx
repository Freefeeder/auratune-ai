'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { HowItWorksAnimation } from "@/components/how-it-works-animation"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>{t("hero.badge")}</span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            {t("hero.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">{t("hero.description")}</p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signin">
              <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90">
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              {t("hero.demo")}
            </Button>
          </div>

          {/* Insert the new animation component here */}
          <HowItWorksAnimation />

        </div>
      </div>
    </section>
  )
}
