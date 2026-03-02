import { createClient } from "@/lib/supabase/server"

// Helper to get supabase client for database operations
export async function getSupabase() {
  return await createClient()
}

// Instructors
export async function getInstructor(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("instructors").select("*").eq("id", id).single()

  if (error || !data) throw new Error("Instructor not found")
  return data
}

export async function getInstructorName(instructorId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("instructors").select("name").eq("id", instructorId).single()

  return data?.name || "Instructor"
}

export async function getInstructorStats(instructorId: string) {
  const supabase = await createClient()

  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("instructor_id", instructorId)

  const { count: totalLessons } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("instructor_id", instructorId)

  const { count: passedCount } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("instructor_id", instructorId)
    .eq("test_result", "passed")

  const students = totalStudents || 0
  const lessons = totalLessons || 0
  const passed = passedCount || 0
  const passRate = students > 0 ? Math.round((passed / students) * 100) : 0

  return {
    passRate,
    averageLessonsToPass: students > 0 ? Math.round(lessons / students) : 0,
    totalStudentsTaught: students,
    adasCompletionRate: 85,
    activeStudents: students,
    monthlyRevenue: 0,
  }
}

export async function getInstructorVerificationStatus(instructorId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("instructors").select("verification_status").eq("id", instructorId).single()

  return data?.verification_status || null
}

// Students
export async function getStudents(instructorId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getStudent(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

  if (error || !data) throw new Error("Student not found")
  return data
}

// Lessons
export async function getLessons(studentId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("lessons")
    .select("*")
    .eq("student_id", studentId)
    .order("scheduled_date", { ascending: false })

  return data || []
}

export async function getLesson(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("lessons").select("*").eq("id", id).single()

  if (error || !data) throw new Error("Lesson not found")
  return data
}

// ADAS Training
export async function getAdasProgress(studentId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("adas_training").select("*").eq("student_id", studentId)

  return data || []
}

// Payments
export async function getPayments(studentId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getOutstandingBalance(studentId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("payments").select("amount").eq("student_id", studentId).eq("status", "pending")

  const total = data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
  return total
}

// Reviews
export async function getReviews(instructorId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("instructor_id", instructorId)
    .eq("verified", true)
    .order("created_at", { ascending: false })

  return data || []
}
