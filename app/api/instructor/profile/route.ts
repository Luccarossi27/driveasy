import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get instructor profile from session
    const sessionResult = await sql`
      SELECT s.user_id, u.name, u.email, u.role
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionToken}
        AND s.expires_at > NOW()
    `

    if (sessionResult.length === 0) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const user = sessionResult[0]

    if (user.role !== "instructor") {
      return NextResponse.json({ error: "Not an instructor" }, { status: 403 })
    }

    // Get instructor details
    const instructorResult = await sql`
      SELECT 
        id,
        phone,
        car_type,
        transmission_type,
        service_areas,
        hourly_rate,
        pass_rate,
        verification_status
      FROM instructors
      WHERE user_id = ${user.user_id}
    `

    if (instructorResult.length === 0) {
      return NextResponse.json({ error: "Instructor profile not found" }, { status: 404 })
    }

    const instructor = instructorResult[0]

    return NextResponse.json({
      instructor: {
        id: instructor.id,
        name: user.name,
        email: user.email,
        phone: instructor.phone,
        carType: instructor.car_type,
        transmissionType: instructor.transmission_type,
        serviceAreas: instructor.service_areas,
        hourlyRate: instructor.hourly_rate,
        passRate: instructor.pass_rate,
        verificationStatus: instructor.verification_status,
      },
    })
  } catch (error) {
    console.error("Failed to get instructor profile:", error)
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 })
  }
}
