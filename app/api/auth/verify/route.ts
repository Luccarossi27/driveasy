import { neon } from "@neondatabase/serverless"
import { getSessionCookie } from "@/lib/session"

export async function GET() {
  try {
    const token = await getSessionCookie()

    if (!token) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const sessions = await sql`SELECT user_id, expires_at FROM sessions WHERE token = ${token}`

    if (sessions.length === 0) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    const session = sessions[0]

    if (new Date(session.expires_at) < new Date()) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    const users = await sql`SELECT id, email, role FROM users WHERE id = ${session.user_id}`

    if (users.length === 0) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    const user = users[0]

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
