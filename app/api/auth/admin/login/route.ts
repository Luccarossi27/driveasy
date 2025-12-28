import { neon } from "@neondatabase/serverless"
import { verifyPassword, generateSessionToken } from "@/lib/auth-utils"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const users = await sql`SELECT id, password_hash, role FROM users WHERE email = ${email} AND role = 'admin'`

    if (users.length === 0) {
      return Response.json({ error: "Invalid credentials or not an admin" }, { status: 401 })
    }

    const user = users[0]

    if (!verifyPassword(password, user.password_hash)) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await sql`INSERT INTO sessions (user_id, token, expires_at) VALUES (${user.id}, ${token}, ${expiresAt})`

    const cookieStore = await cookies()
    cookieStore.set("drivecoach_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    const response = Response.json({ success: true, role: "admin" }, { status: 200 })
    return response
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
