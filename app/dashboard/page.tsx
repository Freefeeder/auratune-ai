import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlaylistGenerator } from "@/components/playlist-generator"
import { UserNav } from "@/components/user-nav"
import { Music } from "lucide-react"
import Link from "next/link"
import { LanguageSelector } from "@/components/language-selector"
import { SubscriptionBanner } from "@/components/subscription-banner"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Music className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AuraTune AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <UserNav user={user} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {subscription && subscription.credits <= 0 && subscription.subscription_type !== "premium" && (
            <SubscriptionBanner />
          )}

          <PlaylistGenerator subscription={subscription} />
        </div>
      </main>
    </div>
  )
}
