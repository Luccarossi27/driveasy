"use client"

import { students } from "@/lib/data"
import { AlertTriangle, TrendingDown, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AtRiskStudents() {
  // Students at risk: test date approaching but progress is plateauing or declining
  const atRiskStudents = students.filter(
    (s) =>
      s.status === "test-booked" ||
      s.progressTrend === "declining" ||
      (s.progressTrend === "plateau" && s.lessonsCompleted > 20),
  )

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="font-semibold text-foreground">Students Needing Attention</h3>
      </div>
      <div className="divide-y divide-border">
        {atRiskStudents.slice(0, 3).map((student) => (
          <div key={student.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 text-sm font-medium text-warning">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{student.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {student.practicalTestDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Test:{" "}
                    {new Date(student.practicalTestDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
                {student.progressTrend !== "improving" && (
                  <span className="flex items-center gap-1 text-warning">
                    <TrendingDown className="h-3 w-3" />
                    {student.progressTrend === "plateau" ? "Plateauing" : "Declining"}
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/students/${student.id}`}>View</Link>
            </Button>
          </div>
        ))}
        {atRiskStudents.length === 0 && (
          <div className="px-5 py-8 text-center text-muted-foreground">All students are on track</div>
        )}
      </div>
    </div>
  )
}
