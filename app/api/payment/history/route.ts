import { cookies } from "next/headers"
import { getStudentPaymentHistory, getInstructorPaymentHistory } from "@/lib/stripe-helpers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userResult = await sql("SELECT * FROM users WHERE session_token = $1", [sessionToken])
    if (!userResult || userResult.length === 0) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = userResult[0]
    const userType = user.role

    let history

    if (userType === "student") {
      const studentResult = await sql("SELECT id FROM students WHERE id = $1", [user.id])
      if (!studentResult || studentResult.length === 0) {
        return Response.json({ error: "Student not found" }, { status: 404 })
      }
      history = await getStudentPaymentHistory(user.id)
    } else if (userType === "instructor") {
      const instructorResult = await sql("SELECT id FROM instructors WHERE id = $1", [user.id])
      if (!instructorResult || instructorResult.length === 0) {
        return Response.json({ error: "Instructor not found" }, { status: 404 })
      }
      history = await getInstructorPaymentHistory(user.id)
    } else {
      return Response.json({ error: "Invalid user type" }, { status: 400 })
    }

    return Response.json(history)
  } catch (error) {
    console.error("[Payment History] Error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to fetch history" }, { status: 500 })
  }
}
