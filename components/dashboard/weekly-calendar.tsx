"use client"

import { weeklyLessons, students } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react"

export function WeeklyCalendar() {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const getLessonsForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return weeklyLessons.filter((l) => l.date === dateStr)
  }

  const getTestDatesForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return students.filter((s) => s.practicalTestDate && s.practicalTestDate.startsWith(dateStr))
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          This Week
        </h3>
      </div>
      <div className="grid grid-cols-7 divide-x divide-border">
        {days.map((date, i) => {
          const lessons = getLessonsForDay(date)
          const testDates = getTestDatesForDay(date)
          const isToday = date.toDateString() === today.toDateString()
          return (
            <div key={i} className="min-h-[120px] p-2">
              <div className={cn("mb-2 text-center", isToday && "text-primary")}>
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("en-GB", { weekday: "short" })}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    isToday &&
                      "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto",
                  )}
                >
                  {date.getDate()}
                </p>
              </div>
              <div className="space-y-1">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded bg-primary/10 px-1.5 py-1 text-xs hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-primary truncate">{lesson.studentName.split(" ")[0]}</p>
                    <p className="text-muted-foreground text-[10px]">{lesson.startTime}</p>
                  </div>
                ))}

                {testDates.map((student) => (
                  <div
                    key={`test-${student.id}`}
                    className="rounded bg-success/10 px-1.5 py-1 text-xs flex items-center gap-1 hover:bg-success/20 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                    <span className="font-medium text-success truncate">{student.name.split(" ")[0]}</span>
                  </div>
                ))}

                {/* Show empty state if no events */}
                {lessons.length === 0 && testDates.length === 0 && (
                  <div className="text-center py-2">
                    <AlertCircle className="h-3 w-3 text-muted-foreground mx-auto opacity-50" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
