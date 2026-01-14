import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  redirect("/diary")
}
