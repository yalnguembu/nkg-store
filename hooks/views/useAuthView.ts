"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

import { authControllerLogin } from '@/lib/api'

export function useAuthView() {
  const [isLoading, setIsLoading] = useState(false)
  const { login, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('auth')

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authControllerLogin({
        body: { email, password }
      })

      if (response.data) {
        const { access_token, user } = response.data as any
        login(access_token, user)
        toast({
          title: t('success'),
          variant: 'default',
        })
        router.push('/admin')
      }
    } catch (error: any) {
      toast({
        title: t('credentialsError'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return {
    isLoading,
    handleLogin,
    handleLogout
  }
}
