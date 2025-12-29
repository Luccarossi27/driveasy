import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { verifySession } from "@/lib/auth-utils"
import { generateInstructorCode } from "@/lib/auth-utils"

// GET - Fetch or generate instructor's code
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    console.log("[v0] Instructor code route: checking session")

    if (!sessionToken) {
      console.log("[v0] No session token found")
      return NextResponse.json({ error: "Unauthorized - no session" }, { status: 401 })
    }

    const session = await verifySession(sessionToken)

    if (!session) {
      console.log("[v0] Session verification failed")
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 })
    }

    if (session.role !== "instructor") {
      console.log("[v0] User role is not instructor:", session.role)
      return NextResponse.json({ error: "Unauthorized - not an instructor" }, { status: 403 })
    }

    console.log("[v0] Fetching instructor for user:", session.userId)

    const instructorResult = await sql`
      SELECT i.id, i.instructor_code, u.name
      FROM instructors i
      JOIN users u ON i.user_id = u.id
      WHERE i.user_id = ${session.userId}
    `

    console.log("[v0] Instructor query result count:", instructorResult.length)

    if (instructorResult.length === 0) {
      console.log("[v0] No instructor record found for user:", session.userId)
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = instructorResult[0]

    // If code already exists, return it
    if (instructor.instructor_code) {
      console.log("[v0] Returning existing code:", instructor.instructor_code)
      return NextResponse.json({ code: instructor.instructor_code })
    }

    // Generate new code if doesn't exist
    const nameParts = (instructor.name || "INSTRUCTOR").trim().split(/\s+/)
    const firstName = nameParts[0] || "INSTRUCTOR"
    const lastName = nameParts[1] || ""

    let newCode = generateInstructorCode(firstName, lastName)
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const existingResult = await sql`
        SELECT id FROM instructors WHERE instructor_code = ${newCode}
      `
      if (existingResult.length === 0) {
        isUnique = true
      } else {
        console.log("[v0] Code exists, regenerating")
        newCode = generateInstructorCode(firstName, lastName)
        attempts++
      }
    }

    if (!isUnique) {
      console.log("[v0] Failed to generate unique code after 10 attempts")
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 })
    }

    // Save the new code
    await sql`
      UPDATE instructors SET instructor_code = ${newCode} WHERE id = ${instructor.id}
    `

    console.log("[v0] Generated and saved code:", newCode)
    return NextResponse.json({ code: newCode })
  } catch (error) {
    console.error("[v0] Instructor code error:", error)
    return NextResponse.json(
      { error: "Failed to fetch instructor code", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
