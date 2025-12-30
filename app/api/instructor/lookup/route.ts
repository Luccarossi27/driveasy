import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const instructorId = searchParams.get("instructor")

    if (!code && !instructorId) {
      return NextResponse.json({ error: "Instructor code or ID is required" }, { status: 400 })
    }

    let result

    if (instructorId) {
      // Direct lookup by instructor ID (from shareable link)
      result = await sql`
        SELECT 
          i.id,
          u.name,
          u.email,
          i.phone,
          i.car_type,
          i.pass_rate,
          i.verification_status
        FROM instructors i
        JOIN users u ON i.user_id = u.id
        WHERE i.id = ${instructorId}::uuid
      `
    } else if (code) {
      // Lookup by instructor code (legacy support)
      result = await sql`
        SELECT 
          i.id,
          u.name,
          u.email,
          i.phone,
          i.car_type,
          i.pass_rate,
          i.verification_status
        FROM instructors i
        JOIN users u ON i.user_id = u.id
        WHERE i.instructor_code = ${code.toUpperCase()}
      `
    }

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = result[0]

    // Check if instructor is verified (optional - you may want to allow unverified during testing)
    // if (instructor.verification_status !== 'approved') {
    //   return NextResponse.json({ error: "Instructor not verified yet" }, { status: 403 })
    // }

    return NextResponse.json({
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        phone: instructor.phone,
        carType: instructor.car_type,
        passRate: instructor.pass_rate || 85,
        verified: instructor.verification_status === "approved",
      },
    })
  } catch (error) {
    console.error("Instructor lookup error:", error)
    return NextResponse.json({ error: "Failed to look up instructor" }, { status: 500 })
  }
}
