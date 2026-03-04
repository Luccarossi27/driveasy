import { createClient } from "@/lib/supabase/server"
import { verifyPassword, generateSessionToken } from "@/lib/auth-utils"
import { setSessionCookie } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: users, error } = await supabase.from("users").select("id, password_hash, role").eq("email", email)

    if (error || !users || users.length === 0) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    if (!verifyPassword(password, user.password_hash)) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await supabase.from("sessions").insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    })

    await setSessionCookie(token, expiresAt)

    return Response.json(
      {
        success: true,
        role: user.role,
        token,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
