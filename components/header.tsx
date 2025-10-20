'use client'
import Link from "next/link"
import { MountainIcon } from "./icons/mountain-icon"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "./language-switcher"
import { UserNav } from "./user-nav" // Importamos el nuevo componente

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background fixed top-0 left-0 right-0 z-50 shadow-sm">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">AuraTune AI</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
          href="#features"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          {t("header.features")}
        </Link>
        <Link
          href="#how-it-works"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          {t("header.howItWorks")}
        </Link>
        <LanguageSwitcher />
        <UserNav />
      </nav>
    </header>
  )
}
