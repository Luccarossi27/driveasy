import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Test connection by querying instructors table
    const { count } = await supabase
      .from("instructors")
      .select("*", { count: "exact", head: true })

    return Response.json({
      success: true,
      message: "Database connected successfully",
      instructorCount: count || 0,
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
