'use client'

import AuthForm from '@/components/auth/auth-form'
import { useLanguage } from '@/lib/language-context'

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('signin.title')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('signin.subtitle')}</p>
        </div>
        <AuthForm />
        <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
          {t('signin.terms')}
        </p>
      </div>
    </div>
  )
}
