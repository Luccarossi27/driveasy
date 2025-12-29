import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { verifySession } from "@/lib/auth-utils"

// GET - Fetch instructor's code
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

    // Get instructor code
    const result = await sql`
      SELECT i.instructor_code, u.name
      FROM instructors i
      JOIN users u ON i.user_id = u.id
      WHERE i.user_id = ${session.userId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = result[0]

    // Generate code if doesn't exist
    if (!instructor.instructor_code) {
      const nameParts = instructor.name.toUpperCase().split(" ")
      const firstName = nameParts[0] || "INSTRUCTOR"
      const lastName = nameParts[1] || ""
      const randomNum = Math.floor(Math.random() * 99) + 1
      const newCode = `${firstName}-${lastName}-${randomNum}`.replace(/--/g, "-")

      await sql`
        UPDATE instructors SET instructor_code = ${newCode} WHERE user_id = ${session.userId}
      `

      return NextResponse.json({ code: newCode })
    }

    return NextResponse.json({ code: instructor.instructor_code })
  } catch (error) {
    console.error("Fetch instructor code error:", error)
    return NextResponse.json({ error: "Failed to fetch instructor code" }, { status: 500 })
  }
}
