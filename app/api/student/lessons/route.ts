import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get user from session
    const sessions = await sql`
      SELECT u.id, u.role 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionToken}
      AND s.expires_at > NOW()
    `

    if (sessions.length === 0) {
      return Response.json({ error: "Invalid session" }, { status: 401 })
    }

    const userId = sessions[0].id

    // Get lessons for this student
    const lessons = await sql`
      SELECT 
        l.id,
        l.student_id,
        s.first_name || ' ' || s.last_name as student_name,
        l.date,
        l.start_time,
        l.end_time,
        l.status,
        l.notes,
        l.ai_summary
      FROM lessons l
      JOIN students s ON l.student_id = s.id
      WHERE l.student_id = ${userId}
      AND l.status = 'completed'
      ORDER BY l.date DESC
    `

    const formattedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      studentId: lesson.student_id,
      studentName: lesson.student_name,
      date: lesson.date,
      startTime: lesson.start_time,
      endTime: lesson.end_time,
      status: lesson.status,
      notes: lesson.notes,
      aiSummary: lesson.ai_summary ? JSON.parse(lesson.ai_summary) : null,
    }))

    return Response.json({ lessons: formattedLessons })
  } catch (error) {
    console.error("Error fetching student lessons:", error)
    return Response.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}
