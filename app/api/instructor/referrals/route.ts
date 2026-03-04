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

    // For now, return empty array as referrals functionality needs to be built
    const referrals: unknown[] = []

    return Response.json({ referrals })
  } catch (error) {
    console.error("Error fetching referrals:", error)
    return Response.json({ error: "Failed to fetch referrals" }, { status: 500 })
  }
}
