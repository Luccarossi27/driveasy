import { createClient } from "@/lib/supabase/server"
import { getSessionCookie, clearSessionCookie } from "@/lib/session"

export async function POST() {
  try {
    const token = await getSessionCookie()

    if (token) {
      const supabase = await createClient()
      await supabase.from("sessions").delete().eq("token", token)
    }

    await clearSessionCookie()

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
