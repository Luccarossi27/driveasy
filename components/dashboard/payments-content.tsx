"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { students, instructorStats } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  PoundSterling,
  Send,
  Receipt,
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Plus,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock payment history
const paymentHistory = [
  {
    id: "p1",
    studentId: "1",
    studentName: "Emma Thompson",
    amount: 68,
    date: "2024-12-20",
    status: "completed",
    type: "lesson",
    description: "2-hour lesson",
  },
  {
    id: "p2",
    studentId: "3",
    studentName: "Sophie Chen",
    amount: 170,
    date: "2024-12-18",
    status: "completed",
    type: "package",
    description: "5-lesson package",
  },
  {
    id: "p3",
    studentId: "2",
    studentName: "James Wilson",
    amount: 68,
    date: "2024-12-15",
    status: "completed",
    type: "lesson",
    description: "2-hour lesson",
  },
  {
    id: "p4",
    studentId: "4",
    studentName: "Oliver Brown",
    amount: 34,
    date: "2024-12-12",
    status: "pending",
    type: "lesson",
    description: "1-hour lesson",
  },
]

// Pricing packages
const initialPackages = [
  { id: "single", name: "Single Lesson", hours: 1, price: 34, savings: 0 },
  { id: "double", name: "Double Lesson", hours: 2, price: 68, savings: 0 },
  { id: "5pack", name: "5-Lesson Package", hours: 10, price: 320, savings: 20 },
  { id: "10pack", name: "10-Lesson Package", hours: 20, price: 620, savings: 60 },
]

export function PaymentsContent() {
  const searchParams = useSearchParams()
  const studentIdParam = searchParams.get("student")

  const [selectedStudent, setSelectedStudent] = useState(studentIdParam || "")
  const [selectedPackage, setSelectedPackage] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [customPackages, setCustomPackages] = useState(initialPackages)
  const [showAddPackage, setShowAddPackage] = useState(false)
  const [newPackage, setNewPackage] = useState({ name: "", hours: 1, price: 0 })

  useEffect(() => {
    if (studentIdParam) {
      setSelectedStudent(studentIdParam)
    }
  }, [studentIdParam])

  const studentsWithBalance = students.filter((s) => s.balance > 0)
  const totalOutstanding = students.reduce((acc, s) => acc + s.balance, 0)
  const selectedStudentData = students.find((s) => s.id === selectedStudent)

  const handleSendRequest = async () => {
    if (!selectedStudent || (!selectedPackage && !customAmount)) return
    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSending(false)
    setSentSuccess(true)
    setTimeout(() => {
      setSentSuccess(false)
      setSelectedPackage("")
      setCustomAmount("")
    }, 2000)
  }

  const handleAddPackage = () => {
    if (newPackage.name && newPackage.price > 0) {
      setCustomPackages([...customPackages, { id: `pkg-${Date.now()}`, ...newPackage }])
      setNewPackage({ name: "", hours: 1, price: 0 })
      setShowAddPackage(false)
    }
  }

  const handleDeletePackage = (id: string) => {
    setCustomPackages(customPackages.filter((pkg) => pkg.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments & Billing</h1>
        <p className="text-muted-foreground">Manage lesson payments and track outstanding balances</p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <PoundSterling className="h-5 w-5 text-primary" />
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">£{instructorStats.monthlyRevenue}</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <PoundSterling className="h-5 w-5 text-success" />
          <p className="text-2xl font-bold text-foreground mt-2">
            £{instructorStats.monthlyRevenue - totalOutstanding}
          </p>
          <p className="text-sm text-muted-foreground">Received</p>
        </div>
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <AlertCircle className="h-5 w-5 text-warning" />
          <p className="text-2xl font-bold text-warning mt-2">£{totalOutstanding}</p>
          <p className="text-sm text-muted-foreground">Outstanding</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Package className="h-5 w-5 text-chart-2" />
          <p className="text-2xl font-bold text-foreground mt-2">8</p>
          <p className="text-sm text-muted-foreground">Packages sold</p>
        </div>
      </div>

      <Tabs defaultValue="request" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="request" className="data-[state=active]:bg-card">
            <Send className="mr-2 h-4 w-4" />
            Request Payment
          </TabsTrigger>
          <TabsTrigger value="outstanding" className="data-[state=active]:bg-card">
            <AlertCircle className="mr-2 h-4 w-4" />
            Outstanding
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-card">
            <Receipt className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-card">
            <CreditCard className="mr-2 h-4 w-4" />
            Pricing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Request Form */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Send Payment Request
              </h2>

              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student" className="bg-secondary">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                        {student.balance > 0 && <span className="ml-2 text-warning">(£{student.balance} owed)</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Package or Amount</Label>
                <div className="grid grid-cols-2 gap-2">
                  {customPackages.map((pkg) => (
                    <Button
                      key={pkg.id}
                      variant={selectedPackage === pkg.id ? "default" : "outline"}
                      className={cn("h-auto py-3 flex-col bg-transparent", selectedPackage === pkg.id && "bg-primary")}
                      onClick={() => {
                        setSelectedPackage(pkg.id)
                        setCustomAmount("")
                      }}
                    >
                      <span className="font-medium">{pkg.name}</span>
                      <span className="text-xs opacity-70">£{pkg.price}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom">Or custom amount</Label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="custom"
                    type="number"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedPackage("")
                    }}
                    className="pl-9 bg-secondary"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendRequest}
                disabled={!selectedStudent || (!selectedPackage && !customAmount) || isSending}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : sentSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Payment Request
                  </>
                )}
              </Button>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Payment Request Preview</h3>
              {selectedStudentData ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">To:</p>
                    <p className="font-medium text-foreground">{selectedStudentData.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedStudentData.email}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Amount:</p>
                    <p className="text-2xl font-bold text-foreground">
                      £{customAmount || customPackages.find((p) => p.id === selectedPackage)?.price || 0}
                    </p>
                    {selectedPackage && (
                      <p className="text-sm text-muted-foreground">
                        {customPackages.find((p) => p.id === selectedPackage)?.name}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Student will receive a secure payment link via email
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Select a student and amount to preview the payment request
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="outstanding" className="space-y-4">
          {studentsWithBalance.length > 0 ? (
            <div className="space-y-3">
              {studentsWithBalance.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 rounded-xl border border-warning/30 bg-warning/5 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-sm font-semibold text-warning">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-warning">£{student.balance}</p>
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                  </div>
                  <Button size="sm" onClick={() => setSelectedStudent(student.id)}>
                    <Send className="mr-2 h-3.5 w-3.5" />
                    Remind
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold text-foreground">All Caught Up!</h3>
              <p className="text-sm text-muted-foreground">No outstanding payments from any students</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold text-foreground">Recent Transactions</h3>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="divide-y divide-border">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      payment.status === "completed" ? "bg-success/10" : "bg-warning/10",
                    )}
                  >
                    {payment.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Clock className="h-5 w-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{payment.studentName}</p>
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">£{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customPackages.map((pkg) => (
              <div key={pkg.id} className="rounded-xl border border-border bg-card p-5 relative group">
                <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">{pkg.hours} hours</p>
                <p className="text-2xl font-bold text-foreground mt-4">£{pkg.price}</p>
                <p className="text-xs text-muted-foreground">£{(pkg.price / pkg.hours).toFixed(2)}/hour</p>
                {customPackages.length > 4 && (
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded text-destructive text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Custom Package */}
          {!showAddPackage ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 flex items-center justify-center">
              <Button variant="outline" className="bg-transparent" onClick={() => setShowAddPackage(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Package
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Create Custom Package</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="pkg-name">Package Name</Label>
                  <Input
                    id="pkg-name"
                    placeholder="e.g., Intensive Crash Course"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    className="bg-secondary mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pkg-hours">Hours</Label>
                    <Input
                      id="pkg-hours"
                      type="number"
                      min="1"
                      value={newPackage.hours}
                      onChange={(e) => setNewPackage({ ...newPackage, hours: Number.parseInt(e.target.value) || 1 })}
                      className="bg-secondary mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pkg-price">Price (£)</Label>
                    <Input
                      id="pkg-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: Number.parseFloat(e.target.value) || 0 })}
                      className="bg-secondary mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPackage} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Package
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddPackage(false)
                    setNewPackage({ name: "", hours: 1, price: 0 })
                  }}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
