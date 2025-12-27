"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { StudentStatusBadge } from "@/components/dashboard/student-status-badge"
import { ProgressTrendBadge } from "@/components/dashboard/progress-trend-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Phone, Mail, Calendar, ChevronRight, Filter, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { StudentStatus, Student } from "@/lib/data"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StudentStatus[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real data from database
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students")
        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(student.status)
    return matchesSearch && matchesStatus
  })

  const toggleStatus = (status: StudentStatus) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage your students and track their progress</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/students/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-card">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {statusFilter.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {statusFilter.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("new")}
              onCheckedChange={() => toggleStatus("new")}
            >
              New
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("active")}
              onCheckedChange={() => toggleStatus("active")}
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("test-booked")}
              onCheckedChange={() => toggleStatus("test-booked")}
            >
              Test Booked
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes("passed")}
              onCheckedChange={() => toggleStatus("passed")}
            >
              Passed
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Link
              key={student.id}
              href={`/dashboard/students/${student.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{student.name}</h3>
                  <StudentStatusBadge status={student.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{student.email}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {student.phone}
                  </span>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{student.lessonsCompleted} lessons</span>
                  <ProgressTrendBadge trend={student.progressTrend} />
                </div>
                {student.practicalTestDate && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Test:{" "}
                    {new Date(student.practicalTestDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No students found. Add your first student to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
