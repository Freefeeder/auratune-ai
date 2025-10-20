"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Sparkles, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface SubscriptionData {
  subscription_type: string
  credits: number
}

export function SubscriptionBanner() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid)
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setSubscription(doc.data().subscription as SubscriptionData)
        }
        setLoading(false)
      })
      return () => unsubscribe()
    } else {
      // Si no hay usuario, no mostramos nada
      setLoading(false)
    }
  }, [user])

  // Renderiza el banner solo si el usuario es free y no tiene créditos
  const shouldRender = !loading && user && subscription && subscription.subscription_type === "free" && subscription.credits <= 0

  if (!shouldRender) {
    return null // No mostrar nada si no se cumplen las condiciones
  }

  return (
    <Card className="border-destructive/50 bg-destructive/5 my-8">
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
