import { generateText } from "ai"

export const maxDuration = 30

// Fallback template-based generator when AI is unavailable
function generateFallbackSummary(
  studentName: string,
  lessonNotes: string,
): {
  summary: string
  strengths: string[]
  weaknesses: string[]
  nextFocus: string
  homework: string
} {
  // Extract key topics from notes
  const hasParking = /parking|reverse|manoeuvre/i.test(lessonNotes)
  const hasMotorway = /motorway|dual|speed/i.test(lessonNotes)
  const hasUrban = /urban|city|traffic|pedestrian/i.test(lessonNotes)
  const hasRoundabout = /roundabout|junction|turns/i.test(lessonNotes)

  const strengths = []
  const weaknesses = []

  if (/good|excellent|confident|smooth|safe/i.test(lessonNotes)) {
    strengths.push("Demonstrates confidence and smooth control")
  }
  if (/observation|mirror|aware|situational/i.test(lessonNotes)) {
    strengths.push("Good situational awareness and mirror checking")
  }
  if (/quick|responsive|reaction/i.test(lessonNotes)) {
    strengths.push("Quick reactions and responsive to feedback")
  }

  if (/struggle|difficulty|hesitant|nervous/i.test(lessonNotes)) {
    weaknesses.push("Needs more confidence in challenging situations")
  }
  if (/speed|rushing|too fast|slow/i.test(lessonNotes)) {
    weaknesses.push("Speed management needs improvement")
  }
  if (/coordination|clutch|gear|smooth/i.test(lessonNotes)) {
    weaknesses.push("Vehicle control and gear changes need refinement")
  }

  return {
    summary: `In today's lesson with ${studentName}, we covered ${[hasParking && "parking", hasMotorway && "motorway driving", hasUrban && "urban navigation", hasRoundabout && "roundabout techniques"].filter(Boolean).join(", ") || "various driving techniques"}. The session focused on building confidence and developing safe driving habits. ${studentName} showed engagement and willingness to improve.`,
    strengths:
      strengths.length > 0
        ? strengths
        : ["Shows commitment to learning", "Follows instructions well", "Maintains vehicle control"],
    weaknesses:
      weaknesses.length > 0
        ? weaknesses
        : ["Could benefit from more practice", "Needs to build confidence", "Speed management requires focus"],
    nextFocus: `Continue practicing ${[hasParking && "parking techniques", hasMotorway && "motorway confidence", hasUrban && "urban driving", hasRoundabout && "roundabouts"].filter(Boolean).join(" and ") || "fundamental techniques"}. Focus on smooth transitions and building confidence in challenging scenarios.`,
    homework:
      "Practice the techniques covered in today's lesson. Pay special attention to observation skills and smooth vehicle control. Record any concerns for next session.",
  }
}

export async function POST(request: Request) {
  try {
    const { studentName, lessonNotes, progressContext } = await request.json()

    if (!lessonNotes?.trim()) {
      return Response.json({ error: "Lesson notes are required" }, { status: 400 })
    }

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        maxTokens: 1000,
        temperature: 0.7,
        prompt: `You are an expert driving instructor AI assistant. Analyze the following lesson notes and provide a structured summary with actionable insights.

Student: ${studentName || "Unknown"}
Current Progress: ${progressContext || "First lesson or progress unknown"}

Lesson Notes:
"${lessonNotes}"

Please provide in this exact JSON format (respond ONLY with valid JSON, no markdown, no code blocks):
{
  "summary": "A comprehensive summary of what was covered",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["area 1", "area 2"],
  "nextFocus": "What should be the focus for the next lesson",
  "homework": "Specific homework or practice tasks"
}`,
      })

      const cleanedText = text.trim()
      const parsed = JSON.parse(cleanedText)

      if (!parsed.summary || !Array.isArray(parsed.strengths) || !Array.isArray(parsed.weaknesses)) {
        throw new Error("Invalid response structure")
      }

      return Response.json(parsed)
    } catch (aiError) {
      console.error(
        "[v0] AI generation error, using fallback:",
        aiError instanceof Error ? aiError.message : String(aiError),
      )

      const fallbackSummary = generateFallbackSummary(studentName || "Student", lessonNotes)
      return Response.json(fallbackSummary)
    }
  } catch (error) {
    console.error("[v0] API error:", error instanceof Error ? error.message : String(error))
    return Response.json({ error: "Failed to generate lesson summary. Please try again." }, { status: 500 })
  }
}
