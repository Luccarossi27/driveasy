import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { studentId, skillRatings, summary, timestamp } = await request.json()

    if (!studentId || !skillRatings || !summary) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert lesson record with assessment
    const { data: result, error } = await supabase
      .from("lessons")
      .insert({
        student_id: studentId,
        scheduled_date: new Date(timestamp).toISOString(),
        completed_date: new Date(timestamp).toISOString(),
        status: "completed",
        ai_summary: JSON.stringify(summary),
        strengths: summary.strengths.join(", "),
        focus_areas: summary.areasToImprove.join(", "),
        homework: `Overall score: ${summary.overallScore}/5`,
        notes: JSON.stringify(skillRatings),
      })
      .select("id, student_id, scheduled_date, ai_summary, strengths, focus_areas")
      .single()

    if (error || !result) {
      throw new Error("Failed to save assessment")
    }

    return Response.json({
      success: true,
      lessonId: result.id,
      message: "Assessment saved successfully and is now visible to the student",
    })
  } catch (error) {
    console.error("[v0] Error saving assessment:", error)
    return Response.json({ error: "Failed to save assessment to database" }, { status: 500 })
  }
}
