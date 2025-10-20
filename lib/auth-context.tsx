'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuario ha iniciado sesión. Vamos a sincronizarlo con Firestore.
        const userRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          // Si el documento del usuario no existe, es un nuevo registro o primer inicio de sesión.
          // Lo creamos con un plan gratuito por defecto.
          try {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              subscription: {
                subscription_type: "free",
                credits: 10, // 10 créditos de bienvenida
                status: "active",
              },
              createdAt: new Date(), // Guardamos la fecha de creación
            })
            console.log(`Nuevo usuario ${user.uid} creado en Firestore con plan gratuito.`)
          } catch (error) {
            console.error("Error al crear el documento del usuario en Firestore:", error)
          }
        }
        setUser(user)
      } else {
        // El usuario ha cerrado sesión.
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
