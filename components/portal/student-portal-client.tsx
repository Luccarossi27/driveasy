"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Brain,
  CheckCircle2,
  AlertCircle,
  Target,
  BookOpen,
  Car,
  CreditCard,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

function StudentDashboardContent({ student }: { student: any }) {
  const upcomingLessons = student.upcomingLessons || []
  const lessonsCompleted = student.lessonsCompleted ?? 0
  const estimatedLessonsToPass = student.estimatedLessonsToPass ?? 0
  const progressPercent =
    lessonsCompleted > 0 && estimatedLessonsToPass > 0
      ? Math.round((lessonsCompleted / (lessonsCompleted + estimatedLessonsToPass)) * 100)
      : 0
  const adasItems = student.adasItems || []
  const adasConfident = adasItems.filter((i: any) => i?.status === "confident").length
  const adasProgress = adasItems.length > 0 ? Math.round((adasConfident / adasItems.length) * 100) : 0
  const paymentHistory = student.paymentHistory || []
  const studentName = student.name?.split(" ")[0] || "Student"

  return (
    <div className="space-y-6 py-4">
      {/* Welcome Header */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {studentName}!</h1>
        <p className="text-muted-foreground mt-1">Track your progress and stay on top of your learning journey</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="text-sm text-foreground">
              <span className="font-semibold">{estimatedLessonsToPass}</span> lessons to test-ready
            </span>
          </div>
          {student.practicalTestDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning" />
              <span className="text-sm text-foreground">
                Test:{" "}
                <span className="font-semibold">
                  {new Date(student.practicalTestDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Lessons Completed</p>
          <p className="text-2xl font-bold text-foreground mt-1">{lessonsCompleted}</p>
          <Progress value={progressPercent} className="h-2 mt-3" />
          <p className="text-xs text-muted-foreground mt-2">{progressPercent}% to test-ready</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Theory Test</p>
          <div className="flex items-center gap-2 mt-1">
            {student.theoryTestPassed ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-success" />
                <span className="text-lg font-semibold text-success">Passed</span>
              </>
            ) : (
              <>
                <Clock className="h-6 w-6 text-warning" />
                <span className="text-lg font-semibold text-warning">Pending</span>
              </>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">ADAS Training</p>
          <p className="text-2xl font-bold text-foreground mt-1">{adasProgress}%</p>
          <Progress value={adasProgress} className="h-2 mt-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {adasConfident} of {adasItems.length} systems
          </p>
        </div>
      </div>

      {/* Upcoming Lessons */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Lessons
          </h2>
        </div>
        <div className="divide-y divide-border">
          {upcomingLessons.slice(0, 3).map((lesson: any) => (
            <div key={lesson?.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="text-xs font-medium">
                  {lesson?.date ? new Date(lesson.date).toLocaleDateString("en-GB", { weekday: "short" }) : ""}
                </span>
                <span className="text-lg font-bold">{lesson?.date ? new Date(lesson.date).getDate() : ""}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Driving Lesson</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {lesson?.startTime} - {lesson?.endTime}
                </div>
              </div>
            </div>
          ))}
          {upcomingLessons.length === 0 && (
            <div className="px-5 py-8 text-center text-muted-foreground">No upcoming lessons scheduled</div>
          )}
        </div>
      </div>

      {/* Latest Lesson Feedback */}
      {student.latestLessonFeedback && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            Latest Lesson Feedback
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              {new Date(student.latestLessonFeedback.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </h2>
          <p className="text-sm text-foreground mb-4">{student.latestLessonFeedback.summary}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-success/10 p-4">
              <h4 className="font-medium text-success flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4" />
                What you did well
              </h4>
              <ul className="space-y-1.5">
                {(student.latestLessonFeedback.strengths || []).map((s: string, i: number) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success mt-2 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-warning/10 p-4">
              <h4 className="font-medium text-warning flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                Areas to focus on
              </h4>
              <ul className="space-y-1.5">
                {(student.latestLessonFeedback.weaknesses || []).map((w: string, i: number) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-card border border-border p-4">
            <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Your homework
            </h4>
            <p className="text-sm text-muted-foreground">{student.latestLessonFeedback.homework}</p>
          </div>
        </div>
      )}

      {/* ADAS Progress */}
      {adasItems.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Car className="h-5 w-5 text-primary" />
            ADAS Training Progress
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {adasItems.map((item: any) => (
              <div
                key={item?.id}
                className={cn(
                  "rounded-lg p-3 text-sm",
                  item?.status === "confident" && "bg-success/10 border border-success/20",
                  item?.status === "practiced" && "bg-warning/10 border border-warning/20",
                  item?.status === "not-taught" && "bg-secondary border border-border",
                )}
              >
                <div className="flex items-center gap-2">
                  {item?.status === "confident" ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : item?.status === "practiced" ? (
                    <AlertCircle className="h-4 w-4 text-warning shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground shrink-0" />
                  )}
                  <span
                    className={cn(
                      "font-medium truncate",
                      item?.status === "confident" && "text-success",
                      item?.status === "practiced" && "text-warning",
                      item?.status === "not-taught" && "text-muted-foreground",
                    )}
                  >
                    {item?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment History
          </h2>
          <Link href="/portal/payments" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {paymentHistory.slice(0, 3).map((payment: any) => (
            <div key={payment?.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-foreground">{payment?.description}</p>
                <p className="text-sm text-muted-foreground">
                  {payment?.date
                    ? new Date(payment.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </div>
              <p className="font-semibold text-foreground">£{payment?.amount}</p>
            </div>
          ))}
          {paymentHistory.length === 0 && (
            <div className="px-5 py-8 text-center text-muted-foreground">No payment history</div>
          )}
        </div>
        {student.balance && student.balance > 0 && (
          <div className="border-t border-warning/30 bg-warning/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <span className="font-medium text-warning">Outstanding Balance</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-warning">£{student.balance}</span>
                <Button size="sm">Pay Now</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" className="h-auto py-4 justify-start bg-card" asChild>
          <Link href="/portal/book">
            <Calendar className="mr-3 h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Book a Lesson</p>
              <p className="text-xs text-muted-foreground">Schedule your next driving lesson</p>
            </div>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 justify-start bg-card" asChild>
          <Link href="/portal/refer">
            <Target className="mr-3 h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Refer a Friend</p>
              <p className="text-xs text-muted-foreground">Get £20 off your next lesson</p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function StudentPortalClient({ hasSession }: { hasSession: boolean }) {
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch("/api/student/profile")
        if (response.ok) {
          const data = await response.json()
          setStudent(data)
        }
      } catch (error) {
        console.error("Failed to fetch student:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading your profile...</div>
  }

  if (!student) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">No student data found</div>
  }

  return <StudentDashboardContent student={student} />
}
