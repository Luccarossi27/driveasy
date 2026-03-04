import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get session
    const { data: session } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", session.user_id)
      .single()

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Not an instructor" }, { status: 403 })
    }

    // Get instructor details
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id, phone, car_type, transmission_type, service_areas, hourly_rate, pass_rate, verification_status")
      .eq("user_id", user.id)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: "Instructor profile not found" }, { status: 404 })
    }

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
