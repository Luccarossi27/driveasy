import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { verifySession } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return NextResponse.json(
        {
          error: "Please create an account first",
          requiresAuth: true,
        },
        { status: 401 },
      )
    }

    // Verify session
    const session = await verifySession(sessionToken)
    if (!session || session.role !== "student") {
      return NextResponse.json(
        {
          error: "Please log in as a student",
          requiresAuth: true,
        },
        { status: 401 },
      )
    }

    const { instructorId } = await request.json()

    if (!instructorId) {
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 })
    }

    // Check if instructor exists and is verified
    const instructorResult = await sql`
      SELECT id, verification_status FROM instructors WHERE id = ${instructorId}
    `

    if (instructorResult.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    if (instructorResult[0].verification_status !== "approved") {
      return NextResponse.json({ error: "Instructor is not verified" }, { status: 400 })
    }

    // Get student ID
    const studentResult = await sql`
      SELECT id, instructor_id FROM students WHERE user_id = ${session.userId}
    `

    if (studentResult.length === 0) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const student = studentResult[0]

    // Check if student already has this instructor
    if (student.instructor_id === instructorId) {
      return NextResponse.json({ error: "You are already connected to this instructor" }, { status: 400 })
    }

    // Update student's instructor
    await sql`
      UPDATE students 
      SET instructor_id = ${instructorId}, updated_at = NOW()
      WHERE id = ${student.id}
    `

    return NextResponse.json({ success: true, message: "Successfully joined instructor" })
  } catch (error) {
    console.error("Join instructor error:", error)
    return NextResponse.json({ error: "Failed to join instructor" }, { status: 500 })
  }
}
