"use client"

import { useState } from "react"
import { instructorStats } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Users,
  Target,
  Car,
  TrendingUp,
  Eye,
  EyeOff,
  BadgeCheck,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReputationPage() {
  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://drivecoach.app/instructor/mike-harrison")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = [
    {
      label: "Pass Rate",
      value: `${instructorStats.passRate}%`,
      icon: Target,
      description: "First-time practical test passes",
      trend: "+3% this year",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Average Lessons to Pass",
      value: instructorStats.averageLessonsToPass,
      icon: TrendingUp,
      description: "Hours until test-ready",
      trend: "Below average (35)",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Students Taught",
      value: instructorStats.totalStudentsTaught,
      icon: Users,
      description: "Total learners trained",
      trend: "+24 this year",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "ADAS Completion",
      value: `${instructorStats.adasCompletionRate}%`,
      icon: Car,
      description: "Students fully ADAS trained",
      trend: "+12% this quarter",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reputation Dashboard</h1>
          <p className="text-muted-foreground">Track your teaching statistics and build credibility</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
            {isPublic ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm text-foreground">{isPublic ? "Public" : "Private"}</span>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>
      </div>

      {/* Verified Badge Card */}
      <div
        className={cn(
          "rounded-xl border p-6 transition-all",
          isPublic ? "border-primary/30 bg-primary/5" : "border-border bg-card",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full",
                isPublic ? "bg-primary/20" : "bg-secondary",
              )}
            >
              <BadgeCheck className={cn("h-8 w-8", isPublic ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Verified Stats Badge</h2>
              <p className="text-sm text-muted-foreground">
                {isPublic
                  ? "Your verified statistics are publicly visible for marketing"
                  : "Make your stats public to earn trust with potential students"}
              </p>
            </div>
          </div>
          {isPublic && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="bg-transparent">
                {copied ? (
                  <>
                    <BadgeCheck className="mr-2 h-4 w-4 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              {isPublic && <Eye className="h-4 w-4 text-success" />}
            </div>
            <div className="mt-4">
              <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
              <p className="text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-success">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pass Rate Breakdown */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Pass Rate Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">First attempt passes</span>
                <span className="font-medium text-foreground">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Second attempt passes</span>
                <span className="font-medium text-foreground">11%</span>
              </div>
              <Progress value={11} className="h-2 [&>div]:bg-warning" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Third+ attempt passes</span>
                <span className="font-medium text-foreground">2%</span>
              </div>
              <Progress value={2} className="h-2 [&>div]:bg-muted-foreground" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">National average pass rate</span>
              <span className="font-medium text-foreground">47%</span>
            </div>
            <p className="text-xs text-success mt-1">You're 40% above the national average</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Active Students</p>
                <p className="text-xs text-muted-foreground">Currently learning</p>
              </div>
              <p className="text-2xl font-bold text-primary">{instructorStats.activeStudents}</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Monthly Lessons</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <p className="text-2xl font-bold text-foreground">48</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Average Rating</p>
                <p className="text-xs text-muted-foreground">From verified reviews</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-warning">4.9</p>
                <span className="text-warning">★</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">Response Rate</p>
                <p className="text-xs text-muted-foreground">To student enquiries</p>
              </div>
              <p className="text-2xl font-bold text-success">98%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Public Profile Preview */}
      {isPublic && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Public Profile Preview</h3>
            <Button variant="outline" size="sm" className="bg-transparent">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Profile
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                MH
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-foreground">Mike Harrison</h4>
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Verified Driving Instructor • Manchester</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Target className="h-4 w-4 text-success" />
                    <span className="text-foreground font-medium">87%</span>
                    <span className="text-muted-foreground">pass rate</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-chart-2" />
                    <span className="text-foreground font-medium">156</span>
                    <span className="text-muted-foreground">students taught</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-warning">★</span>
                    <span className="text-foreground font-medium">4.9</span>
                    <span className="text-muted-foreground">(24 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
