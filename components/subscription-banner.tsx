"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function SubscriptionBanner() {
  const { t } = useLanguage()

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {t("subscription.noCredits")}
        </CardTitle>
        <CardDescription>{t("subscription.noCreditsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/pricing">
          <Button className="w-full" size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            {t("subscription.upgrade")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
