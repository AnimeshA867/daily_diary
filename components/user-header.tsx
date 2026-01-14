"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface UserHeaderProps {
  user: {
    email?: string
    id: string
  }
}

export default function UserHeader({ user }: UserHeaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    setIsLoading(true)

    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="border-b border-border px-4 py-6 md:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Daily Diary</h1>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  )
}
