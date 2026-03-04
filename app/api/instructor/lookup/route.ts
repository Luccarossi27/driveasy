import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const instructorId = searchParams.get("instructor")

    if (!code && !instructorId) {
      return NextResponse.json({ error: "Instructor code or ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    let instructorData = null

    if (instructorId) {
      // Direct lookup by instructor ID (from shareable link)
      const { data: instructor } = await supabase
        .from("instructors")
        .select("id, phone, car_type, pass_rate, verification_status, user_id")
        .eq("id", instructorId)
        .single()

      if (instructor) {
        const { data: user } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", instructor.user_id)
          .single()

        instructorData = { ...instructor, name: user?.name, email: user?.email }
      }
    } else if (code) {
      // Lookup by instructor code (legacy support)
      const { data: instructor } = await supabase
        .from("instructors")
        .select("id, phone, car_type, pass_rate, verification_status, user_id")
        .eq("instructor_code", code.toUpperCase())
        .single()

      if (instructor) {
        const { data: user } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", instructor.user_id)
          .single()

        instructorData = { ...instructor, name: user?.name, email: user?.email }
      }
    }

    if (!instructorData) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    return NextResponse.json({
      instructor: {
        id: instructorData.id,
        name: instructorData.name,
        email: instructorData.email,
        phone: instructorData.phone,
        carType: instructorData.car_type,
        passRate: instructorData.pass_rate || 85,
        verified: instructorData.verification_status === "approved",
      },
    })
  } catch (error) {
    console.error("Instructor lookup error:", error)
    return NextResponse.json({ error: "Failed to look up instructor" }, { status: 500 })
  }
}
