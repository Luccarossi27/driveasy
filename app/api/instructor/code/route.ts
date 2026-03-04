import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { verifySession, generateInstructorCode } from "@/lib/auth-utils"

// GET - Fetch or generate instructor's code
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized - no session" }, { status: 401 })
    }

    const session = await verifySession(sessionToken)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 })
    }

    if (session.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized - not an instructor" }, { status: 403 })
    }

    const supabase = await createClient()

    // Get instructor with user name
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id, instructor_code")
      .eq("user_id", session.userId)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    // Get user name
    const { data: user } = await supabase
      .from("users")
      .select("name")
      .eq("id", session.userId)
      .single()

    // If code already exists, return it
    if (instructor.instructor_code) {
      return NextResponse.json({ code: instructor.instructor_code })
    }

    // Generate new code if doesn't exist
    const nameParts = (user?.name || "INSTRUCTOR").trim().split(/\s+/)
    const firstName = nameParts[0] || "INSTRUCTOR"
    const lastName = nameParts[1] || ""

    let newCode = generateInstructorCode(firstName, lastName)
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from("instructors")
        .select("id")
        .eq("instructor_code", newCode)
        .single()

      if (!existing) {
        isUnique = true
      } else {
        newCode = generateInstructorCode(firstName, lastName)
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 })
    }

    // Save the new code
    await supabase
      .from("instructors")
      .update({ instructor_code: newCode })
      .eq("id", instructor.id)

    return NextResponse.json({ code: newCode })
  } catch (error) {
    console.error("Instructor code error:", error)
    return NextResponse.json(
      { error: "Failed to fetch instructor code", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
