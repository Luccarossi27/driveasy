// Type definitions for the driving instructor dashboard
// Note: Mock data has been removed - all data should come from the database

export type StudentStatus = "new" | "active" | "test-booked" | "passed"
export type ConfidenceLevel = "not-taught" | "practiced" | "confident"
export type ProgressTrend = "improving" | "plateau" | "declining"

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  status: StudentStatus
  avatar?: string
  licenceNumber?: string
  theoryTestPassed: boolean
  theoryTestDate?: string
  practicalTestDate?: string
  lessonsCompleted: number
  totalLessons: number
  estimatedLessonsToPass: number
  progressTrend: ProgressTrend
  balance: number
  joinedDate: string
  lastLessonDate: string
  referredBy?: string
}

export interface Lesson {
  id: string
  studentId: string
  studentName: string
  date: string
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  aiSummary?: {
    summary: string
    strengths: string[]
    weaknesses: string[]
    nextFocus: string
    homework: string
  }
}

export interface ADASItem {
  id: string
  name: string
  description: string
  status: ConfidenceLevel
  notes?: string
}

export interface StudentADAS {
  studentId: string
  items: ADASItem[]
}

export interface Review {
  id: string
  studentId: string
  studentName: string
  rating: number
  comment: string
  date: string
  isPublic: boolean
}

export interface InstructorStats {
  passRate: number
  averageLessonsToPass: number
  totalStudentsTaught: number
  adasCompletionRate: number
  activeStudents: number
  monthlyRevenue: number
}

// ADAS Checklist Template
export const adasTemplate: Omit<ADASItem, "status" | "notes">[] = [
  {
    id: "adas1",
    name: "Adaptive Cruise Control",
    description: "Understanding and safe use of ACC systems",
  },
  {
    id: "adas2",
    name: "Lane Keep Assist",
    description: "Lane departure warnings and steering assistance",
  },
  {
    id: "adas3",
    name: "Autonomous Emergency Braking",
    description: "Understanding AEB and collision avoidance",
  },
  {
    id: "adas4",
    name: "Parking Assist",
    description: "Parking sensors and automated parking systems",
  },
  {
    id: "adas5",
    name: "Blind Spot Monitoring",
    description: "Using blind spot detection systems safely",
  },
  {
    id: "adas6",
    name: "Traffic Sign Recognition",
    description: "Understanding speed limit and sign alerts",
  },
]

// These should be replaced with database queries in the components that use them
export const students: Student[] = []
export const todaysLessons: Lesson[] = []
export const weeklyLessons: Lesson[] = []
export const reviews: Review[] = []

export const instructorStats: InstructorStats = {
  passRate: 0,
  averageLessonsToPass: 0,
  totalStudentsTaught: 0,
  adasCompletionRate: 0,
  activeStudents: 0,
  monthlyRevenue: 0,
}

export const emmaADAS: StudentADAS = {
  studentId: "",
  items: adasTemplate.map((item) => ({
    ...item,
    status: "not-taught" as ConfidenceLevel,
  })),
}

export const recentLessonWithSummary: Lesson = {
  id: "",
  studentId: "",
  studentName: "",
  date: "",
  startTime: "",
  endTime: "",
  status: "completed",
  notes: "",
  aiSummary: {
    summary: "",
    strengths: [],
    weaknesses: [],
    nextFocus: "",
    homework: "",
  },
}
