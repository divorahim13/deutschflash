'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogIn, Mail, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginWithEmail, signUpWithEmail } from './actions'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from '@/lib/i18n/context'

export default function LoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const isConfigMissing = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    
    const res = await loginWithEmail(formData)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    
    const res = await signUpWithEmail(formData)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    } else if (res?.msg) {
      alert(res.msg)
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="container relative min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <Card className="w-full max-w-md border-border/40 shadow-xl glass">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">{t.login.title}</CardTitle>
          <CardDescription>
            {t.login.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConfigMissing && (
            <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t.login.configRequired}</AlertTitle>
              <AlertDescription className="text-xs">
                {t.login.missingUrl}
              </AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">{t.login.loginTab}</TabsTrigger>
              <TabsTrigger value="register">{t.login.registerTab}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.login.email}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t.login.password}</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button className="w-full bg-primary hover:opacity-90" type="submit" disabled={loading}>
                  {loading ? t.login.processing : t.login.signInEmail}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button className="w-full variant-outline" type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t.login.orContinue}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex gap-2 items-center hover:bg-muted/50 transition-colors"
            onClick={handleGoogleLogin}
          >
            <LogIn size={18} />
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-xs text-muted-foreground w-full">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
