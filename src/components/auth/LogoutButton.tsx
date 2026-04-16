'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'global' })
    // Hard redirect — clears all stale cookies properly
    window.location.href = '/login'
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="gap-2 text-muted-foreground hover:text-red-500 transition-colors"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  )
}
