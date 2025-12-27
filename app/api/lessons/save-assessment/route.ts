import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { studentId, skillRatings, summary, timestamp } = await request.json()

    if (!studentId || !skillRatings || !summary) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert lesson record with assessment
    const result = await sql`
      INSERT INTO lessons (
        student_id,
        scheduled_date,
        completed_date,
        status,
        ai_summary,
        strengths,
        focus_areas,
        homework,
        notes
      ) VALUES (
        ${studentId},
        ${new Date(timestamp)},
        ${new Date(timestamp)},
        'completed',
        ${JSON.stringify(summary)},
        ${summary.strengths.join(", ")},
        ${summary.areasToImprove.join(", ")},
        ${`Overall score: ${summary.overallScore}/5`},
        ${JSON.stringify(skillRatings)}
      )
      RETURNING id, student_id, scheduled_date, ai_summary, strengths, focus_areas
    `

    if (!result || result.length === 0) {
      throw new Error("Failed to save assessment")
    }

    return Response.json({
      success: true,
      lessonId: result[0].id,
      message: "Assessment saved successfully and is now visible to the student",
    })
  } catch (error) {
    console.error("[v0] Error saving assessment:", error)
    return Response.json({ error: "Failed to save assessment to database" }, { status: 500 })
  }
}
