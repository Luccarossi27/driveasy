import { cookies } from "next/headers"
import { getOrCreateStripeCustomer, createPaymentIntent } from "@/lib/stripe-helpers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
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
      .select("id, email, name")
      .eq("id", session.user_id)
      .single()

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    // Get student
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!student) {
      return Response.json({ error: "Student not found" }, { status: 404 })
    }

    const { packageId, instructorId, amountCents } = await request.json()

    if (!packageId || !instructorId || !amountCents) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get instructor details
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id, user_id")
      .eq("id", instructorId)
      .single()

    if (!instructor) {
      return Response.json({ error: "Instructor not found" }, { status: 404 })
    }

    // Get instructor user name
    const { data: instructorUser } = await supabase
      .from("users")
      .select("name")
      .eq("id", instructor.user_id)
      .single()

    // Create or get Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, user.email, user.name || "")

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
      instructorName: instructorUser?.name || "Instructor",
    })
  } catch (error) {
    console.error("[Payment] Error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Payment initialization failed" },
      { status: 500 },
    )
  }
}
