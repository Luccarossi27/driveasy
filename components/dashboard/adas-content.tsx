"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { students, adasTemplate, emmaADAS, type ConfidenceLevel, type ADASItem } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Car, AlertTriangle, CheckCircle2, Circle, Brain, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const confidenceLevels: { value: ConfidenceLevel; label: string; color: string }[] = [
  { value: "not-taught", label: "Not Taught", color: "text-muted-foreground" },
  { value: "practiced", label: "Practiced", color: "text-warning" },
  { value: "confident", label: "Confident", color: "text-success" },
]

export function ADASContent() {
  const searchParams = useSearchParams()
  const studentIdParam = searchParams.get("student")

  const [selectedStudent, setSelectedStudent] = useState(studentIdParam || "")
  const [adasItems, setAdasItems] = useState<ADASItem[]>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const activeStudents = students.filter((s) => s.status !== "passed")
  const selectedStudentData = students.find((s) => s.id === selectedStudent)

  useEffect(() => {
    if (selectedStudent) {
      // Use Emma's data if selected, otherwise use template
      if (selectedStudent === "1") {
        setAdasItems(emmaADAS.items)
      } else {
        setAdasItems(
          adasTemplate.map((t) => ({
            ...t,
            status: "not-taught" as ConfidenceLevel,
            notes: "",
          })),
        )
      }
    }
  }, [selectedStudent])

  const updateItemStatus = (itemId: string, status: ConfidenceLevel) => {
    setAdasItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status } : item)))
  }

  const updateItemNotes = (itemId: string, notes: string) => {
    setAdasItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, notes } : item)))
  }

  const confidentCount = adasItems.filter((i) => i.status === "confident").length
  const practicedCount = adasItems.filter((i) => i.status === "practiced").length
  const notTaughtCount = adasItems.filter((i) => i.status === "not-taught").length
  const completionPercent = adasItems.length > 0 ? Math.round((confidentCount / adasItems.length) * 100) : 0

  // AI highlights weak areas
  const weakAreas = adasItems.filter((i) => i.status === "not-taught" || i.status === "practiced")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ADAS Training Checklist</h1>
          <p className="text-muted-foreground">
            Track autonomous and driver assistance system training for each student
          </p>
        </div>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-full sm:w-64 bg-card">
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

      {selectedStudent ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Checklist */}
          <div className="lg:col-span-2 space-y-4">
            {adasItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border bg-card transition-all",
                  item.status === "confident" && "border-success/30",
                  item.status === "practiced" && "border-warning/30",
                  item.status === "not-taught" && "border-border",
                )}
              >
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      item.status === "confident" && "bg-success/10",
                      item.status === "practiced" && "bg-warning/10",
                      item.status === "not-taught" && "bg-secondary",
                    )}
                  >
                    {item.status === "confident" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : item.status === "practiced" ? (
                      <Car className="h-5 w-5 text-warning" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-sm font-medium hidden sm:block",
                        confidenceLevels.find((l) => l.value === item.status)?.color,
                      )}
                    >
                      {confidenceLevels.find((l) => l.value === item.status)?.label}
                    </span>
                    {expandedItem === item.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedItem === item.id && (
                  <div className="border-t border-border p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <div className="flex gap-2">
                        {confidenceLevels.map((level) => (
                          <Button
                            key={level.value}
                            variant={item.status === level.value ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              updateItemStatus(item.id, level.value)
                            }}
                            className={cn(
                              item.status === level.value &&
                                level.value === "confident" &&
                                "bg-success text-success-foreground hover:bg-success/90",
                              item.status === level.value &&
                                level.value === "practiced" &&
                                "bg-warning text-warning-foreground hover:bg-warning/90",
                              item.status !== level.value && "bg-transparent",
                            )}
                          >
                            {level.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Notes</label>
                      <Textarea
                        placeholder="Add notes about this student's progress..."
                        value={item.notes || ""}
                        onChange={(e) => updateItemNotes(item.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-secondary"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Overall Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">{completionPercent}%</span>
                  </div>
                  <Progress value={completionPercent} className="h-3" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-success/10 p-3">
                    <p className="text-xl font-bold text-success">{confidentCount}</p>
                    <p className="text-xs text-muted-foreground">Confident</p>
                  </div>
                  <div className="rounded-lg bg-warning/10 p-3">
                    <p className="text-xl font-bold text-warning">{practicedCount}</p>
                    <p className="text-xs text-muted-foreground">Practiced</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xl font-bold text-muted-foreground">{notTaughtCount}</p>
                    <p className="text-xs text-muted-foreground">Not Taught</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            {weakAreas.length > 0 && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Recommendations
                </h3>
                <div className="space-y-3">
                  {weakAreas.slice(0, 3).map((area) => (
                    <div key={area.id} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{area.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {area.status === "not-taught"
                            ? "Consider introducing this system soon"
                            : "More practice recommended before test"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Info */}
            {selectedStudentData && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-4">Student Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {selectedStudentData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedStudentData.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedStudentData.lessonsCompleted} lessons completed
                      </p>
                    </div>
                  </div>
                  {selectedStudentData.practicalTestDate && (
                    <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3 text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="text-foreground">
                        Test: {new Date(selectedStudentData.practicalTestDate).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button className="w-full">Save Progress</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 flex flex-col items-center justify-center text-center">
          <Car className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Select a Student</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Choose a student from the dropdown above to view and update their ADAS training progress. Track their
            familiarity with modern vehicle systems.
          </p>
        </div>
      )}
    </div>
  )
}
