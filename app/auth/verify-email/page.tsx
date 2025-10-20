"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">{t.auth.checkEmail}</CardTitle>
            <CardDescription className="text-center">{t.auth.verifyEmailDescription}</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">{t.auth.verifyEmailNote}</CardContent>
        </Card>
      </div>
    </div>
  )
}
