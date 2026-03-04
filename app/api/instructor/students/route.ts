import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
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
      return Response.json({ error: "Invalid session" }, { status: 401 })
    }

    // Get user role
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user_id)
      .single()

    if (!user || user.role !== "instructor") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get instructor
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id")
      .eq("user_id", session.user_id)
      .single()

    if (!instructor) {
      return Response.json({ error: "Instructor not found" }, { status: 404 })
    }

    // Check for status filter
    const url = new URL(request.url)
    const statusFilter = url.searchParams.get("status")

    let query = supabase
      .from("students")
      .select("id, first_name, last_name, email, status, practical_test_date")
      .eq("instructor_id", instructor.id)
      .order("created_at", { ascending: false })

    if (statusFilter) {
      query = query.eq("status", statusFilter)
    }

    const { data: students } = await query

    const formattedStudents = (students || []).map((s) => ({
      id: s.id,
      name: `${s.first_name} ${s.last_name}`,
      email: s.email,
      status: s.status,
      practicalTestDate: s.practical_test_date,
    }))

    return Response.json({ students: formattedStudents })
  } catch (error) {
    console.error("Error fetching students:", error)
    return Response.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
