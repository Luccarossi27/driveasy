import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Instructor code is required" }, { status: 400 })
    }

    // Look up instructor by code
    const result = await sql`
      SELECT 
        i.id,
        u.name,
        u.email,
        i.phone,
        i.car_type,
        i.pass_rate
      FROM instructors i
      JOIN users u ON i.user_id = u.id
      WHERE i.instructor_code = ${code.toUpperCase()}
        AND i.verification_status = 'approved'
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Instructor not found or not verified" }, { status: 404 })
    }

    const instructor = result[0]

    return NextResponse.json({
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        phone: instructor.phone,
        carType: instructor.car_type,
        passRate: instructor.pass_rate || 85,
      },
    })
  } catch (error) {
    console.error("Instructor lookup error:", error)
    return NextResponse.json({ error: "Failed to look up instructor" }, { status: 500 })
  }
}
