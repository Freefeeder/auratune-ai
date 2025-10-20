'use client'

import { withAuth } from '@/components/auth/with-auth'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function SettingsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <main className="container mx-auto px-4 py-8 pt-24">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {t('settings.title')}
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 sm:mt-4">
            {t('settings.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.profile.title')}</CardTitle>
            <CardDescription>{t('settings.profile.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('settings.profile.name')}</Label>
              <Input id="displayName" defaultValue={user?.displayName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.profile.email')}</Label>
              <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled>{t('settings.profile.save')}</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">{t('settings.dangerZone.title')}</CardTitle>
            <CardDescription>{t('settings.dangerZone.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled>
              {t('settings.dangerZone.delete')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default withAuth(SettingsPage)
