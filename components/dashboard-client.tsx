'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Star, Loader2 } from "lucide-react"
import { PlaylistGenerator } from "@/components/playlist-generator"

interface SubscriptionData {
  subscription_type: string
  credits: number
  status: string
}

export function DashboardClient() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid)
      
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          setSubscription(data.subscription as SubscriptionData)
        } else {
          console.log("No se encontró el documento del usuario.")
        }
        setLoading(false)
      }, (error) => {
        console.error("Error al obtener los datos de suscripción:", error)
        setLoading(false)
      })

      // Cleanup: cancelar la suscripción al desmontar el componente
      return () => unsubscribe()
    }
  }, [user])

  const renderSubscriptionInfo = () => {
    if (loading) {
      return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    }

    if (!subscription) {
      return <p>No se pudieron cargar los datos de la suscripción.</p>
    }

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tu Plan Actual</CardTitle>
            <CardDescription>Así es como estás usando AuraTune.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-2">
                {subscription.subscription_type === 'premium' ? (
                  <Star className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Coins className="h-5 w-5 text-gray-500" />
                )}
                <span className="font-semibold capitalize">
                  {subscription.subscription_type} 
                </span>
              </div>
              <Badge variant={subscription.status === 'active' ? "secondary" : "destructive"}>
                {subscription.status}
              </Badge>
            </div>
            {subscription.subscription_type === 'free' && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="font-semibold">Créditos Restantes</span>
                <span className="font-bold text-primary text-lg">{subscription.credits}</span>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Aquí podrías añadir otra tarjeta con historial o ajustes */}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {renderSubscriptionInfo()}
      <PlaylistGenerator />
    </div>
  )
}
