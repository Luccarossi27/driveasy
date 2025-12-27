import { StatCard } from "@/components/dashboard/stat-card"
import { TodaySchedule } from "@/components/dashboard/today-schedule"
import { AtRiskStudents } from "@/components/dashboard/at-risk-students"
import { WeeklyCalendar } from "@/components/dashboard/weekly-calendar"
import { QuickActions } from "@/components/dashboard/quick-actions"
import {
  getStudents,
  getLessons,
  getInstructorStats,
  getInstructorName,
  getInstructorVerificationStatus,
} from "@/lib/db"
import { Calendar, Users, AlertTriangle, PoundSterling } from "lucide-react"
import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")?.value

  if (!sessionToken) {
    return <div>Not authenticated</div>
  }

  let instructorId: string
  try {
    const decoded = jwtDecode<{ userId: string }>(sessionToken)
    instructorId = decoded.userId
  } catch {
    return <div>Invalid session</div>
  }

  const verificationStatus = await getInstructorVerificationStatus(instructorId)

  if (verificationStatus === "pending") {
    // Instructor hasn't submitted documents yet
    redirect("/onboarding/instructor")
  }

  if (verificationStatus === "under_review") {
    // Documents submitted, waiting for approval
    redirect("/onboarding/instructor/pending")
  }

  if (verificationStatus === "rejected") {
    // Application was rejected
    redirect("/onboarding/instructor/rejected")
  }

  // Only approved instructors reach this point
  // Fetch real data from database
  const instructorName = await getInstructorName(instructorId)
  const students = await getStudents(instructorId)
  const lessons = await getLessons(instructorId)
  const stats = await getInstructorStats(instructorId)

  const activeStudents = students.filter((s: any) => s.status !== "passed").length
  const outstandingBalance = students.reduce((acc: number, s: any) => acc + (s.balance || 0), 0)
  const atRiskCount = students.filter(
    (s: any) => s.progressTrend === "declining" || s.progressTrend === "plateau",
  ).length
  const todaysLessons = lessons.filter((l: any) => new Date(l.date).toDateString() === new Date().toDateString())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good morning, {instructorName}</h1>
        <p className="text-muted-foreground">Here's what's happening with your students today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Lessons"
          value={todaysLessons.length}
          subtitle={
            todaysLessons.length > 0
              ? `Next: ${todaysLessons[0].startTime} - ${todaysLessons[0].studentName}`
              : "No lessons scheduled"
          }
          icon={Calendar}
          variant="primary"
        />
        <StatCard title="Active Students" value={activeStudents} icon={Users} trend={{ value: 8, isPositive: true }} />
        <StatCard
          title="Outstanding Balance"
          value={`£${outstandingBalance}`}
          subtitle={`From ${students.filter((s: any) => s.balance > 0).length} students`}
          icon={PoundSterling}
          variant="warning"
        />
        <StatCard
          title="Students At Risk"
          value={atRiskCount}
          subtitle="Need attention"
          icon={AlertTriangle}
          variant={atRiskCount > 0 ? "warning" : "success"}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TodaySchedule />
          <WeeklyCalendar />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <AtRiskStudents />
        </div>
      </div>
    </div>
  )
}
