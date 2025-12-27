"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle2, Brain, Target, BookOpen, Loader2 } from "lucide-react"

interface LessonSummary {
  summary: string
  strengths: string[]
  weaknesses: string[]
  nextFocus: string
  homework: string
}

interface Lesson {
  id: string
  studentId: string
  studentName: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
  aiSummary?: LessonSummary
}

// Mock completed lessons for history (will be replaced with real data from API)
const mockLessonHistory: Lesson[] = [
  {
    id: "h1",
    studentId: "1",
    studentName: "Student",
    date: "2024-12-20",
    startTime: "09:00",
    endTime: "11:00",
    status: "completed",
    notes: "Practiced parallel parking and bay parking. Worked on reverse maneuvers.",
    aiSummary: {
      summary:
        "Solid session focusing on parking maneuvers. Parallel parking has improved significantly, showing good spatial awareness. Bay parking still needs refinement.",
      strengths: [
        "Good clutch control during slow maneuvers",
        "Excellent use of reference points",
        "Calm under pressure",
      ],
      weaknesses: ["Bay parking angle consistency", "Occasionally forgets final observation"],
      nextFocus: "Perfect bay parking technique with consistent angles.",
      homework: "Visualize the reference points for bay parking. Practice judging distances as a pedestrian.",
    },
  },
  {
    id: "h2",
    studentId: "1",
    studentName: "Student",
    date: "2024-12-17",
    startTime: "14:00",
    endTime: "16:00",
    status: "completed",
    notes: "Independent driving session. Covered routes around town centre.",
    aiSummary: {
      summary:
        "First fully independent driving session went very well. Navigated confidently using road signs and showed good route planning instincts.",
      strengths: ["Confident independent navigation", "Good awareness of road signs", "Safe speed choices"],
      weaknesses: ["Minor hesitation at complex junctions", "Could plan lane position earlier"],
      nextFocus: "Build confidence at complex junctions through exposure.",
      homework: "Study junction layouts on Google Maps for familiar areas. Notice road sign positioning.",
    },
  },
  {
    id: "h3",
    studentId: "1",
    studentName: "Student",
    date: "2024-12-13",
    startTime: "09:00",
    endTime: "11:00",
    status: "completed",
    notes: "Dual carriageway and motorway slip roads practice.",
  },
  {
    id: "h4",
    studentId: "1",
    studentName: "Student",
    date: "2024-12-10",
    startTime: "14:00",
    endTime: "16:00",
    status: "completed",
    notes: "Town centre driving, pedestrian crossings, and traffic light junctions.",
  },
]

export default function LessonHistoryPage() {
  const [lessonHistory, setLessonHistory] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLessons() {
      try {
        // For now, use mock data - will be replaced with real API call
        setLessonHistory(mockLessonHistory)
      } catch (error) {
        console.error("Failed to fetch lessons:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLessons()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lesson History</h1>
        <p className="text-muted-foreground mt-1">Review your past lessons and feedback</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{lessonHistory.length}</p>
          <p className="text-xs text-muted-foreground">Total Lessons</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{lessonHistory.length * 2}</p>
          <p className="text-xs text-muted-foreground">Hours Driven</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">-</p>
          <p className="text-xs text-muted-foreground">Test Ready</p>
        </div>
      </div>

      {/* Lesson List */}
      {lessonHistory.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No lessons yet. Book your first lesson to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessonHistory.map((lesson) => (
            <div key={lesson.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Lesson Header */}
              <div className="flex items-center gap-4 p-4 border-b border-border">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-xs font-medium">
                    {new Date(lesson.date).toLocaleDateString("en-GB", { weekday: "short" })}
                  </span>
                  <span className="text-lg font-bold">{new Date(lesson.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {new Date(lesson.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.startTime} - {lesson.endTime}
                  </div>
                </div>
                {lesson.aiSummary && (
                  <div className="flex items-center gap-1 text-primary">
                    <Brain className="h-4 w-4" />
                    <span className="text-xs font-medium">Summary</span>
                  </div>
                )}
              </div>

              {/* Lesson Notes */}
              {lesson.notes && (
                <div className="px-4 py-3 bg-secondary/30">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Instructor Notes: </span>
                    {lesson.notes}
                  </p>
                </div>
              )}

              {/* AI Summary (if available) */}
              {lesson.aiSummary && (
                <div className="p-4 space-y-4">
                  <p className="text-sm text-foreground">{lesson.aiSummary.summary}</p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-success/10 p-3">
                      <h4 className="font-medium text-success flex items-center gap-2 mb-2 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {lesson.aiSummary.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-success mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg bg-warning/10 p-3">
                      <h4 className="font-medium text-warning flex items-center gap-2 mb-2 text-sm">
                        <Target className="h-4 w-4" />
                        Focus Areas
                      </h4>
                      <ul className="space-y-1">
                        {lesson.aiSummary.weaknesses.map((w, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-warning mt-1.5 shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg bg-card border border-border p-3">
                    <h4 className="font-medium text-foreground flex items-center gap-2 mb-1 text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Homework
                    </h4>
                    <p className="text-xs text-muted-foreground">{lesson.aiSummary.homework}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
