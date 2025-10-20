import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AuraTune AI - Playlists Emocionales con IA",
  description: "Crea playlists personalizadas de Spotify basadas en tus emociones usando inteligencia artificial",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProvider>
          <LanguageProvider initialLocale="es">{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}