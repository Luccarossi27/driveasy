import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get session and user info
    const sessions = await sql`
      SELECT * FROM sessions WHERE token = $1
    `[sessionToken]

    if (sessions.length === 0) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const userId = sessions[0].user_id

    // Get all students for this instructor
    const students = await sql`
      SELECT * FROM students WHERE instructor_id = $1 ORDER BY created_at DESC
    `[userId]

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
