"use client"

import { todaysLessons } from "@/lib/data"
import { Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TodaySchedule() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-semibold text-foreground">Today's Schedule</h3>
        <span className="text-sm text-muted-foreground">
          {todaysLessons.length} lesson{todaysLessons.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="divide-y divide-border">
        {todaysLessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{lesson.studentName}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {lesson.startTime} - {lesson.endTime}
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/insights?student=${lesson.studentId}`}>Add Notes</Link>
            </Button>
          </div>
        ))}
        {todaysLessons.length === 0 && (
          <div className="px-5 py-8 text-center text-muted-foreground">No lessons scheduled for today</div>
        )}
      </div>
    </div>
  )
}
