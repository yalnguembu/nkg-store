"use client"

import { useAuthView } from "@/hooks/views/useAuthView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const t = useTranslations('auth')
  const { handleLogin, isLoading } = useAuthView()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('login')}</CardTitle>
          <CardDescription className="text-center">
            {t('welcome')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@elektrik.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
                <Button variant="link" className="p-0 h-auto text-xs" type="button">
                  {t('forgotPassword')}
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('signIn')}
            </Button>
            <div className="text-sm text-center text-slate-500">
              {t('noAccount')}{" "}
              <Button variant="link" className="p-0 h-auto" type="button">
                {t('signUp')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
