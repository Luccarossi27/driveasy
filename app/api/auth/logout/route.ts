import { neon } from "@neondatabase/serverless"
import { getSessionCookie, clearSessionCookie } from "@/lib/session"

export async function POST() {
  try {
    const token = await getSessionCookie()

    if (token) {
      const sql = neon(process.env.DATABASE_URL!)
      await sql`DELETE FROM sessions WHERE token = ${token}`
    }

    await clearSessionCookie()

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
