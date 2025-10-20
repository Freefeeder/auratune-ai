'use client'

import { useAuth } from '@/lib/auth-context'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useLanguage } from '@/lib/language-context'

export function UserNav() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Redirect to home or login page after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  if (loading) {
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" /> // Skeleton loader
  }

  if (!user) {
    return (
      <Link href="/login" legacyBehavior passHref>
        <Button asChild>{t('signin.button')}</Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/dashboard">{t('userNav.dashboard')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings">{t('userNav.settings')}</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>{t('userNav.logout')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
