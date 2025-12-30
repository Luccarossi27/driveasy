import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get instructor from session
    const sessions = await sql`
      SELECT u.id, u.role 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${sessionToken}
      AND s.expires_at > NOW()
    `

    if (sessions.length === 0 || sessions[0].role !== "instructor") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorId = sessions[0].id

    // Get reviews for this instructor (if reviews table exists)
    // For now, return empty array as reviews functionality needs to be built
    const reviews: unknown[] = []

    return Response.json({
      reviews,
      reviewLink: `${process.env.NEXT_PUBLIC_APP_URL || ""}/review/${instructorId}`,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
