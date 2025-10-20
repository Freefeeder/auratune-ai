'use client'

import { useState } from 'react'
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/language-context'

type AuthMode = 'login' | 'signup'

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      window.location.href = '/dashboard'
    } catch (error: any) {
      setError(error.message)
      console.error("Error signing in with Google: ", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      window.location.href = '/dashboard'
    } catch (error: any) {
      // Improve error messages for the user
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError("Este correo electrónico ya está en uso.")
          break
        case 'auth/invalid-email':
          setError("El formato del correo electrónico no es válido.")
          break
        case 'auth/weak-password':
          setError("La contraseña debe tener al menos 6 caracteres.")
          break
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError("Correo electrónico o contraseña incorrectos.")
          break
        default:
          setError("Ocurrió un error. Por favor, inténtalo de nuevo.")
          break
      }
      console.error(`Error with ${mode}: `, error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t('auth.emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Cargando...' : (mode === 'login' ? t('auth.loginButton') : t('auth.signupButton'))}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{t('auth.or')}</span>
        </div>
      </div>

      <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={loading}>
        {t('auth.loginWithGoogle')}
      </Button>

      <div className="text-center text-sm">
        <Button onClick={toggleMode} variant="link" disabled={loading}>
          {mode === 'login' ? t('auth.toggle.signup') : t('auth.toggle.login')}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  )
}
