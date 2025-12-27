import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Instructors
export async function getInstructor(id: string) {
  const result = await sql`SELECT * FROM instructors WHERE id = ${id}`
  if (result.length === 0) throw new Error("Instructor not found")
  return result[0]
}

export async function getInstructorName(instructorId: string) {
  const result = await sql`SELECT name FROM instructors WHERE id = ${instructorId}`
  if (result.length === 0) return "Instructor"
  return result[0].name
}

export async function getInstructorStats(instructorId: string) {
  const students = await sql`SELECT COUNT(*) as count FROM students WHERE instructor_id = ${instructorId}`
  const lessons = await sql`SELECT COUNT(*) as count FROM lessons WHERE instructor_id = ${instructorId}`
  const passedStudents =
    await sql`SELECT COUNT(*) as count FROM students WHERE instructor_id = ${instructorId} AND test_passed = true`

  const totalStudents = students[0]?.count || 0
  const totalLessons = lessons[0]?.count || 0
  const passedCount = passedStudents[0]?.count || 0
  const passRate = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0

  return {
    passRate,
    averageLessonsToPass: totalStudents > 0 ? Math.round(totalLessons / totalStudents) : 0,
    totalStudentsTaught: totalStudents,
    adasCompletionRate: 85,
    activeStudents: totalStudents,
    monthlyRevenue: 0,
  }
}

export async function getInstructorVerificationStatus(instructorId: string) {
  const result = await sql`
    SELECT verification_status FROM instructors WHERE id = ${instructorId}
  `
  if (result.length === 0) return null
  return result[0].verification_status
}

// Students
export async function getStudents(instructorId: string) {
  const result = await sql`
    SELECT * FROM students 
    WHERE instructor_id = ${instructorId}
    ORDER BY created_at DESC
  `
  return result
}

export async function getStudent(id: string) {
  const result = await sql`SELECT * FROM students WHERE id = ${id}`
  if (result.length === 0) throw new Error("Student not found")
  return result[0]
}

// Lessons
export async function getLessons(studentId: string) {
  const result = await sql`
    SELECT * FROM lessons 
    WHERE student_id = ${studentId}
    ORDER BY scheduled_date DESC
  `
  return result
}

export async function getLesson(id: string) {
  const result = await sql`SELECT * FROM lessons WHERE id = ${id}`
  if (result.length === 0) throw new Error("Lesson not found")
  return result[0]
}

// ADAS Training
export async function getAdasProgress(studentId: string) {
  const result = await sql`
    SELECT * FROM adas_training 
    WHERE student_id = ${studentId}
  `
  return result
}

// Payments
export async function getPayments(studentId: string) {
  const result = await sql`
    SELECT * FROM payments 
    WHERE student_id = ${studentId}
    ORDER BY created_at DESC
  `
  return result
}

export async function getOutstandingBalance(studentId: string) {
  const result = await sql`
    SELECT COALESCE(SUM(amount), 0) as total 
    FROM payments 
    WHERE student_id = ${studentId} AND status = 'pending'
  `
  return result[0]?.total || 0
}

// Reviews
export async function getReviews(instructorId: string) {
  const result = await sql`
    SELECT * FROM reviews 
    WHERE instructor_id = ${instructorId} AND verified = true
    ORDER BY created_at DESC
  `
  return result
}
