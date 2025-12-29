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

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await verifySession(sessionToken)
    if (!session || session.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get instructor info
    const result = await sql`
      SELECT i.id, i.instructor_code, u.name
      FROM instructors i
      JOIN users u ON i.user_id = u.id
      WHERE i.user_id = ${session.userId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = result[0]

    // If code already exists, return it
    if (instructor.instructor_code) {
      console.log("[v0] Returning existing instructor code:", instructor.instructor_code)
      return NextResponse.json({ code: instructor.instructor_code })
    }

    // Generate new code if doesn't exist
    const nameParts = instructor.name.trim().split(/\s+/)
    const firstName = nameParts[0] || "INSTRUCTOR"
    const lastName = nameParts[1] || ""

    let newCode = generateInstructorCode(firstName, lastName)

    let isUnique = false
    let attempts = 0
    while (!isUnique && attempts < 10) {
      const existing = await sql`
        SELECT instructor_code FROM instructors WHERE instructor_code = ${newCode}
      `
      if (existing.length === 0) {
        isUnique = true
      } else {
        console.log("[v0] Code collision detected, regenerating:", newCode)
        newCode = generateInstructorCode(firstName, lastName)
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 })
    }

    // Save the new code
    await sql`
      UPDATE instructors SET instructor_code = ${newCode} WHERE id = ${instructor.id}
    `

    console.log("[v0] Generated new instructor code:", newCode)
    return NextResponse.json({ code: newCode })
  } catch (error) {
    console.error("[v0] Fetch instructor code error:", error)
    return NextResponse.json({ error: "Failed to fetch instructor code" }, { status: 500 })
  }
}
