"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle2, Brain, Target, BookOpen, Loader2, Calendar } from "lucide-react"

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

export default function LessonHistoryPage() {
  const [lessonHistory, setLessonHistory] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch("/api/student/lessons")
        if (response.ok) {
          const data = await response.json()
          setLessonHistory(data.lessons || [])
        } else {
          // No lessons yet - that's fine for new users
          setLessonHistory([])
        }
      } catch (err) {
        console.error("Failed to fetch lessons:", err)
        setError("Failed to load lesson history")
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

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

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
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No lessons yet</h3>
          <p className="text-muted-foreground">Book your first lesson with an instructor to get started!</p>
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
                    <div className="rounded-lg bg-green-500/10 p-3">
                      <h4 className="font-medium text-green-600 flex items-center gap-2 mb-2 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {lesson.aiSummary.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg bg-amber-500/10 p-3">
                      <h4 className="font-medium text-amber-600 flex items-center gap-2 mb-2 text-sm">
                        <Target className="h-4 w-4" />
                        Focus Areas
                      </h4>
                      <ul className="space-y-1">
                        {lesson.aiSummary.weaknesses.map((w, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
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
