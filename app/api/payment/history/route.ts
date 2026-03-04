import { cookies } from "next/headers"
import { getStudentPaymentHistory, getInstructorPaymentHistory } from "@/lib/stripe-helpers"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
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
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", session.user_id)
      .single()

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    let history

    if (user.role === "student") {
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!student) {
        return Response.json({ error: "Student not found" }, { status: 404 })
      }
      history = await getStudentPaymentHistory(student.id)
    } else if (user.role === "instructor") {
      const { data: instructor } = await supabase
        .from("instructors")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!instructor) {
        return Response.json({ error: "Instructor not found" }, { status: 404 })
      }
      history = await getInstructorPaymentHistory(instructor.id)
    } else {
      return Response.json({ error: "Invalid user type" }, { status: 400 })
    }

    return Response.json(history)
  } catch (error) {
    console.error("[Payment History] Error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to fetch history" }, { status: 500 })
  }
}
