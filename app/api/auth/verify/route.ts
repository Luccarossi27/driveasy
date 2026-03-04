import { createClient } from "@/lib/supabase/server"
import { getSessionCookie } from "@/lib/session"

export async function GET() {
  try {
    const token = await getSessionCookie()

    if (!token) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: session } = await supabase.from("sessions").select("user_id, expires_at").eq("token", token).single()

    if (!session) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    if (new Date(session.expires_at) < new Date()) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    const { data: user } = await supabase.from("users").select("id, email, role").eq("id", session.user_id).single()

    if (!user) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    return Response.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Verify error:", error)
    return Response.json({ authenticated: false }, { status: 500 })
  }
}
