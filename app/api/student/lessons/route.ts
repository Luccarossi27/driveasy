import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
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

    // Get student
    const { data: student } = await supabase
      .from("students")
      .select("id, first_name, last_name")
      .eq("user_id", session.user_id)
      .single()

    if (!student) {
      return Response.json({ lessons: [] })
    }

    // Get lessons for this student
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, student_id, date, start_time, end_time, status, notes, ai_summary")
      .eq("student_id", student.id)
      .eq("status", "completed")
      .order("date", { ascending: false })

    const formattedLessons = (lessons || []).map((lesson) => ({
      id: lesson.id,
      studentId: lesson.student_id,
      studentName: `${student.first_name} ${student.last_name}`,
      date: lesson.date,
      startTime: lesson.start_time,
      endTime: lesson.end_time,
      status: lesson.status,
      notes: lesson.notes,
      aiSummary: lesson.ai_summary ? JSON.parse(lesson.ai_summary) : null,
    }))

    return Response.json({ lessons: formattedLessons })
  } catch (error) {
    console.error("Error fetching student lessons:", error)
    return Response.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}
