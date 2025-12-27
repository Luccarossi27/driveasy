"use client"

import Link from "next/link"

import { students, recentLessonWithSummary, emmaADAS, adasTemplate } from "@/lib/data"
import { StudentStatusBadge } from "@/components/dashboard/student-status-badge"
import { ProgressTrendBadge } from "@/components/dashboard/progress-trend-badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  ClipboardCheck,
  Brain,
  Car,
  CreditCard,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const student = students.find((s) => s.id === id)

  if (!student) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Student not found</p>
      </div>
    )
  }

  // Use Emma's ADAS data for demo, or default template
  const studentADAS = id === "1" ? emmaADAS : null
  const adasItems = studentADAS?.items || adasTemplate.map((t) => ({ ...t, status: "not-taught" as const }))
  const adasProgress = studentADAS
    ? Math.round((adasItems.filter((i) => i.status === "confident").length / adasItems.length) * 100)
    : 0

  const progressPercent = Math.round(
    (student.lessonsCompleted / (student.lessonsCompleted + student.estimatedLessonsToPass)) * 100,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/students">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
            <StudentStatusBadge status={student.status} />
          </div>
          <p className="text-muted-foreground">
            Student since{" "}
            {new Date(student.joinedDate).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/insights?student=${student.id}`}>
              <Sparkles className="mr-2 h-4 w-4" />
              Add Insights
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/payments?student=${student.id}`}>
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact & Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-foreground">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{student.phone}</span>
              </div>
              {student.licenceNumber && (
                <div className="flex items-center gap-3 text-sm">
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{student.licenceNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-foreground">Test Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theory Test</span>
                {student.theoryTestPassed ? (
                  <span className="flex items-center gap-1 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Passed
                  </span>
                ) : student.theoryTestDate ? (
                  <span className="flex items-center gap-1 text-sm text-warning">
                    <Calendar className="h-4 w-4" />
                    {new Date(student.theoryTestDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Circle className="h-4 w-4" />
                    Not booked
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Practical Test</span>
                {student.status === "passed" ? (
                  <span className="flex items-center gap-1 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Passed
                  </span>
                ) : student.practicalTestDate ? (
                  <span className="flex items-center gap-1 text-sm text-warning">
                    <Calendar className="h-4 w-4" />
                    {new Date(student.practicalTestDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Circle className="h-4 w-4" />
                    Not booked
                  </span>
                )}
              </div>
            </div>
          </div>

          {student.balance > 0 && (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <h3 className="font-semibold text-warning">Outstanding Balance</h3>
              </div>
              <p className="mt-2 text-2xl font-bold text-warning">£{student.balance}</p>
              <Button className="mt-3 w-full" size="sm" asChild>
                <Link href={`/dashboard/payments?student=${student.id}`}>Request Payment</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Progress & AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Progress Overview</h3>
              <ProgressTrendBadge trend={student.progressTrend} />
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <p className="text-2xl font-bold text-foreground">{student.lessonsCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. to Test Ready</p>
                <p className="text-2xl font-bold text-primary">{student.estimatedLessonsToPass}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="mt-2">
                  <Progress value={progressPercent} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">{progressPercent}% to test ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Panel */}
          {recentLessonWithSummary.aiSummary && id === "1" && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Latest AI Insights</h3>
                <span className="text-xs text-muted-foreground">
                  from{" "}
                  {new Date(recentLessonWithSummary.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground mb-4">{recentLessonWithSummary.aiSummary.summary}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-success mb-2">Strengths</p>
                  <ul className="space-y-1">
                    {recentLessonWithSummary.aiSummary.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-warning mb-2">Areas to Improve</p>
                  <ul className="space-y-1">
                    {recentLessonWithSummary.aiSummary.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-secondary p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Next Lesson Focus</p>
                <p className="text-sm text-foreground">{recentLessonWithSummary.aiSummary.nextFocus}</p>
              </div>
            </div>
          )}

          {/* ADAS Progress */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">ADAS Training</h3>
              </div>
              <Link href={`/dashboard/adas?student=${student.id}`} className="text-sm text-primary hover:underline">
                View Details
              </Link>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium text-foreground">{adasProgress}%</span>
              </div>
              <Progress value={adasProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {adasItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg p-2 text-xs",
                    item.status === "confident" && "bg-success/10 text-success",
                    item.status === "practiced" && "bg-warning/10 text-warning",
                    item.status === "not-taught" && "bg-secondary text-muted-foreground",
                  )}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
