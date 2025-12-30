import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get instructor from session
    const sessions = await sql`
      SELECT u.id, u.role 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionToken}
      AND s.expires_at > NOW()
    `

    if (sessions.length === 0 || sessions[0].role !== "instructor") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorId = sessions[0].id

    // Check for status filter
    const url = new URL(request.url)
    const statusFilter = url.searchParams.get("status")

    let students
    if (statusFilter) {
      students = await sql`
        SELECT 
          id,
          first_name || ' ' || last_name as name,
          email,
          status,
          practical_test_date
        FROM students
        WHERE instructor_id = ${instructorId}
        AND status = ${statusFilter}
        ORDER BY created_at DESC
      `
    } else {
      students = await sql`
        SELECT 
          id,
          first_name || ' ' || last_name as name,
          email,
          status,
          practical_test_date
        FROM students
        WHERE instructor_id = ${instructorId}
        ORDER BY created_at DESC
      `
    }

    const formattedStudents = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      status: s.status,
      practicalTestDate: s.practical_test_date,
    }))

    return Response.json({ students: formattedStudents })
  } catch (error) {
    console.error("Error fetching students:", error)
    return Response.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
