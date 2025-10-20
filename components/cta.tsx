"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function CTA() {
  const { t } = useLanguage()

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/20 via-accent/10 to-background p-12 md:p-16">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-accent/30 blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">{t("cta.title")}</h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground">{t("cta.description")}</p>
            <Link href="/auth/signin">
              <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90">
                {t("cta.button")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
