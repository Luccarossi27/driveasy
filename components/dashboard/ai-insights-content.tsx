"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { students } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus, Target, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface SkillRating {
  skill: string
  rating: number
}

interface LessonSummary {
  strengths: string[]
  areasToImprove: string[]
  nextFocus: string
  overallScore: number
}

const AVAILABLE_SKILLS = [
  "Vehicle Control",
  "Road Positioning",
  "Speed Management",
  "Mirror Checking",
  "Signal Usage",
  "Junction Handling",
  "Roundabout Navigation",
  "Parking",
  "Reversing",
  "Emergency Stops",
  "Observation & Awareness",
  "Decision Making",
  "Pedestrian Awareness",
  "Lane Discipline",
  "Gear Changing",
  "Braking Technique",
]

export function AIInsightsContent() {
  const searchParams = useSearchParams()
  const studentIdParam = searchParams.get("student")

  const [selectedStudent, setSelectedStudent] = useState(studentIdParam || "")
  const [skillRatings, setSkillRatings] = useState<SkillRating[]>(
    AVAILABLE_SKILLS.map((skill) => ({ skill, rating: 0 })),
  )
  const [generatedSummary, setGeneratedSummary] = useState<LessonSummary | null>(null)
  const [hasRated, setHasRated] = useState(false)

  useEffect(() => {
    if (studentIdParam) {
      setSelectedStudent(studentIdParam)
    }
  }, [studentIdParam])

  const handleGenerateSummary = () => {
    const ratedSkills = skillRatings.filter((s) => s.rating > 0)
    if (ratedSkills.length === 0) return

    const avgScore = Math.round((ratedSkills.reduce((sum, s) => sum + s.rating, 0) / ratedSkills.length) * 10) / 10
    const strengths = ratedSkills.filter((s) => s.rating >= 4).map((s) => s.skill)
    const areasToImprove = ratedSkills.filter((s) => s.rating <= 2).map((s) => s.skill)
    const mediumSkills = ratedSkills.filter((s) => s.rating === 3).map((s) => s.skill)

    const summary: LessonSummary = {
      strengths: strengths.length > 0 ? strengths : ["Good attempt at covered skills"],
      areasToImprove: areasToImprove.length > 0 ? areasToImprove : mediumSkills.slice(0, 2),
      nextFocus:
        areasToImprove.length > 0
          ? `Focus on improving: ${areasToImprove.slice(0, 2).join(" and ")}`
          : "Continue practicing and refining covered skills",
      overallScore: avgScore,
    }

    setGeneratedSummary(summary)
    setHasRated(true)
  }

  const activeStudents = students.filter((s) => s.status !== "passed")
  const selectedStudentData = students.find((s) => s.id === selectedStudent)
  const ratedCount = skillRatings.filter((s) => s.rating > 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lesson Skill Assessment</h1>
        <p className="text-muted-foreground">Rate your student's skills during today's lesson and generate a summary</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Rate Today's Lesson
            </h2>

            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger id="student" className="bg-secondary">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {activeStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skills Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Skills to Rate</Label>
                <span className="text-sm text-muted-foreground">
                  {ratedCount} / {AVAILABLE_SKILLS.length} rated
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {skillRatings.map((item) => (
                  <div key={item.skill} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">{item.skill}</label>
                      <span className="text-xs text-muted-foreground">
                        {item.rating === 0 ? "Not rated" : `${item.rating}/5`}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            const updated = skillRatings.map((s) =>
                              s.skill === item.skill ? { ...s, rating: star } : s,
                            )
                            setSkillRatings(updated)
                            setHasRated(false)
                          }}
                          className={cn(
                            "p-1.5 rounded transition-colors",
                            star <= item.rating
                              ? "bg-primary text-white"
                              : "bg-secondary hover:bg-secondary/80 text-muted-foreground",
                          )}
                          title={`Rate ${star} out of 5`}
                        >
                          <Star className="h-4 w-4" fill={star <= item.rating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleGenerateSummary} disabled={!selectedStudent || ratedCount === 0} className="w-full">
              {ratedCount === 0 ? "Rate at least one skill to continue" : "Generate Lesson Summary"}
            </Button>
          </div>

          {/* Student Quick Stats */}
          {selectedStudentData && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Student Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedStudentData.lessonsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Lessons</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedStudentData.estimatedLessonsToPass}</p>
                  <p className="text-xs text-muted-foreground">Est. Remaining</p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    {selectedStudentData.progressTrend === "improving" && (
                      <TrendingUp className="h-5 w-5 text-success" />
                    )}
                    {selectedStudentData.progressTrend === "plateau" && <Minus className="h-5 w-5 text-warning" />}
                    {selectedStudentData.progressTrend === "declining" && (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{selectedStudentData.progressTrend}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {generatedSummary && hasRated && (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  Overall Lesson Performance
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{generatedSummary.overallScore}</span>
                  <span className="text-lg text-muted-foreground">/5</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {skillRatings.filter((s) => s.rating > 0).length} rated skills
                </p>
              </div>

              {/* Strengths */}
              <div className="rounded-xl border border-success/30 bg-success/5 p-5">
                <h4 className="font-semibold text-success flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4" />
                  Strengths Demonstrated
                </h4>
                {generatedSummary.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {generatedSummary.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-success mt-2 shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No highly rated skills yet</p>
                )}
              </div>

              {/* Areas to Improve */}
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
                <h4 className="font-semibold text-warning flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4" />
                  Areas to Focus On
                </h4>
                {generatedSummary.areasToImprove.length > 0 ? (
                  <ul className="space-y-2">
                    {generatedSummary.areasToImprove.map((area, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">All rated skills are strong</p>
                )}
              </div>

              {/* Next Focus */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-primary" />
                  Next Lesson Focus
                </h4>
                <p className="text-sm text-muted-foreground">{generatedSummary.nextFocus}</p>
              </div>

              {/* Recommendation */}
              <div className="rounded-xl border border-chart-2/30 bg-chart-2/5 p-5">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-chart-2" />
                  Recommended Focus Areas
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Continue to develop these areas in the next lesson:
                </p>
                <ul className="space-y-1">
                  {skillRatings
                    .filter((s) => s.rating > 0 && s.rating <= 2)
                    .map((skill) => (
                      <li key={skill.skill} className="text-sm text-foreground flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-chart-2 mt-2 shrink-0" />
                        {skill.skill}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Share with Student
                </Button>
                <Button className="flex-1">Save Assessment</Button>
              </div>
            </div>
          )}

          {!generatedSummary && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Rate Skills to Generate Summary</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Select a student and rate their performance across different driving skills. A summary will be
                automatically generated based on your ratings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
