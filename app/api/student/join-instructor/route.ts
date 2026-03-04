import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
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

    const supabase = await createClient()

    // Check if instructor exists and is verified
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id, verification_status")
      .eq("id", instructorId)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    if (instructor.verification_status !== "approved") {
      return NextResponse.json({ error: "Instructor is not verified" }, { status: 400 })
    }

    // Get student
    const { data: student } = await supabase
      .from("students")
      .select("id, instructor_id")
      .eq("user_id", session.userId)
      .single()

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    // Check if student already has this instructor
    if (student.instructor_id === instructorId) {
      return NextResponse.json({ error: "You are already connected to this instructor" }, { status: 400 })
    }

    // Update student's instructor
    await supabase
      .from("students")
      .update({ instructor_id: instructorId, updated_at: new Date().toISOString() })
      .eq("id", student.id)

    return NextResponse.json({ success: true, message: "Successfully joined instructor" })
  } catch (error) {
    console.error("Join instructor error:", error)
    return NextResponse.json({ error: "Failed to join instructor" }, { status: 500 })
  }
}
