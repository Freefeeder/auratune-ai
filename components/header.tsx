"use client"

import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { LanguageSelector } from "@/components/language-selector"

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">AuraTune AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            {t("header.features")}
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            {t("header.howItWorks")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Link href="/auth/login">
            <Button variant="ghost">{t("auth.login")}</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>{t("auth.signUp")}</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
