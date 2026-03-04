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

    // For now, return empty array as reviews functionality needs to be built
    const reviews: unknown[] = []

    return Response.json({
      reviews,
      reviewLink: `${process.env.NEXT_PUBLIC_APP_URL || ""}/review/${instructor?.id || ""}`,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
