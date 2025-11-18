"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function HeaderLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-semibold"
    >
      <LogOut size={20} />
      Sair
    </Button>
  )
}