import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Test connection by querying instructors table
    const result = await sql`SELECT COUNT(*) as count FROM instructors`

    return Response.json({
      success: true,
      message: "Database connected successfully",
      instructorCount: result[0]?.count || 0,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    )
  }
}
