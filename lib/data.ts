// Mock data for the driving instructor dashboard

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

// Recent completed lesson with AI summary
export const recentLessonWithSummary: Lesson = {
  id: "l-recent",
  studentId: "1",
  studentName: "Emma Thompson",
  date: "2024-12-23",
  startTime: "09:00",
  endTime: "11:00",
  status: "completed",
  notes: "Practiced roundabouts and dual carriageway driving. Good progress on lane discipline.",
  aiSummary: {
    summary:
      "Emma showed excellent progress today with roundabout navigation and dual carriageway joining. Her observation skills have improved significantly, and she's becoming more confident with speed management.",
    strengths: [
      "Excellent mirror checks before lane changes",
      "Confident approach to roundabouts",
      "Good speed management on dual carriageways",
    ],
    weaknesses: [
      "Occasionally late signalling when exiting roundabouts",
      "Could be more decisive in merging situations",
    ],
    nextFocus: "Focus on timing of signals at roundabouts and building confidence with merging into faster traffic.",
    homework: "Review the Highway Code section on roundabout signals. Practice observation routines as a passenger.",
  },
}

export const students: Student[] = []

export const weeklyLessons: Lesson[] = [
  {
    id: "l-mon",
    studentId: "1",
    studentName: "Emma Thompson",
    date: "2024-12-23",
    startTime: "09:00",
    endTime: "11:00",
    status: "scheduled",
  },
  {
    id: "l-wed",
    studentId: "2",
    studentName: "James Wilson",
    date: "2024-12-25",
    startTime: "14:00",
    endTime: "16:00",
    status: "scheduled",
  },
  {
    id: "l-fri",
    studentId: "3",
    studentName: "Sophia Martinez",
    date: "2024-12-27",
    startTime: "10:00",
    endTime: "12:00",
    status: "scheduled",
  },
]

export const todaysLessons: Lesson[] = []

export const emmaADAS: StudentADAS = {
  studentId: "1",
  items: [
    {
      id: "adas1",
      name: "Adaptive Cruise Control",
      description: "Understanding and safe use of ACC systems",
      status: "practiced",
    },
    {
      id: "adas2",
      name: "Lane Keep Assist",
      description: "Lane departure warnings and steering assistance",
      status: "confident",
    },
    {
      id: "adas3",
      name: "Autonomous Emergency Braking",
      description: "Understanding AEB and collision avoidance",
      status: "practiced",
    },
    {
      id: "adas4",
      name: "Parking Assist",
      description: "Parking sensors and automated parking systems",
      status: "not-taught",
    },
    {
      id: "adas5",
      name: "Blind Spot Monitoring",
      description: "Using blind spot detection systems safely",
      status: "confident",
    },
    {
      id: "adas6",
      name: "Traffic Sign Recognition",
      description: "Understanding speed limit and sign alerts",
      status: "practiced",
    },
  ],
}

export const instructorStats: InstructorStats = {
  passRate: 87,
  averageLessonsToPass: 45,
  totalStudentsTaught: 23,
  adasCompletionRate: 78,
  activeStudents: 8,
  monthlyRevenue: 3200,
}

export const reviews: Review[] = []
