import { cookies } from "next/headers"
import { getOrCreateStripeCustomer, createPaymentIntent } from "@/lib/stripe-helpers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user
    const userResult = await sql("SELECT * FROM users WHERE session_token = $1", [sessionToken])
    if (!userResult || userResult.length === 0) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = userResult[0]
    const studentResult = await sql("SELECT * FROM students WHERE id = $1", [user.id])
    if (!studentResult || studentResult.length === 0) {
      return Response.json({ error: "Student not found" }, { status: 404 })
    }

    const student = studentResult[0]
    const { packageId, instructorId, amountCents } = await request.json()

    if (!packageId || !instructorId || !amountCents) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get instructor details
    const instructorResult = await sql("SELECT * FROM instructors WHERE id = $1", [instructorId])
    if (!instructorResult || instructorResult.length === 0) {
      return Response.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = instructorResult[0]

    // Create or get Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, user.email, `${user.name}`)

    // Create payment intent
    const { clientSecret } = await createPaymentIntent(
      customerId,
      amountCents,
      `Lesson package - ${packageId}`,
      student.id,
      instructorId,
      packageId,
    )

    return Response.json({
      clientSecret,
      instructorName: instructor.name,
    })
  } catch (error) {
    console.error("[Payment] Error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Payment initialization failed" },
      { status: 500 },
    )
  }
}
