"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertCircle, CheckCircle2, Download, Package, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Student {
  id: string
  name: string
  balance: number
  lessonsCompleted: number
}

const paymentHistory = [
  { id: "1", amount: 68, date: "2024-12-20", description: "2-hour lesson", status: "paid" },
  { id: "2", amount: 170, date: "2024-12-10", description: "5-lesson package", status: "paid" },
  { id: "3", amount: 68, date: "2024-11-28", description: "2-hour lesson", status: "paid" },
  { id: "4", amount: 68, date: "2024-11-21", description: "2-hour lesson", status: "paid" },
  { id: "5", amount: 320, date: "2024-11-01", description: "10-lesson package", status: "paid" },
]

const packages = [
  { id: "1", name: "Single Lesson", hours: 2, price: 68, savings: 0 },
  { id: "2", name: "5 Lesson Package", hours: 10, price: 320, savings: 20 },
  { id: "3", name: "10 Lesson Package", hours: 20, price: 600, savings: 80 },
]

export default function StudentPaymentsClient() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch("/api/auth/verify")
        if (res.ok) {
          const data = await res.json()
          setStudent(data.user)
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const balance = student?.balance ?? 0
  const lessonsCompleted = student?.lessonsCompleted ?? 0

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-1">Manage your payments and view history</p>
      </div>

      {/* Outstanding Balance */}
      {balance > 0 ? (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-warning">Outstanding Balance</p>
                <p className="text-sm text-muted-foreground">Please pay to continue booking</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-warning">£{balance}</p>
              <Button size="sm" className="mt-2">
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-success/30 bg-success/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-success">All Paid Up</p>
              <p className="text-sm text-muted-foreground">You have no outstanding balance</p>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Packages */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          Lesson Packages
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                "rounded-lg border p-4 relative",
                pkg.savings > 0 ? "border-primary/50 bg-primary/5" : "border-border",
              )}
            >
              {pkg.savings > 0 && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  Save £{pkg.savings}
                </div>
              )}
              <p className="font-semibold text-foreground">{pkg.name}</p>
              <p className="text-sm text-muted-foreground">{pkg.hours} hours</p>
              <p className="text-xl font-bold text-foreground mt-2">£{pkg.price}</p>
              <p className="text-xs text-muted-foreground">
                £{((pkg.price / pkg.hours) * 2).toFixed(0)} per 2hr lesson
              </p>
              <Button variant={pkg.savings > 0 ? "default" : "outline"} size="sm" className="w-full mt-3">
                Buy Package
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment History
          </h2>
          <Button variant="ghost" size="sm" className="text-primary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="divide-y divide-border">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{payment.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-foreground">£{payment.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total Spent */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">
              £{paymentHistory.reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Lessons Completed</p>
            <p className="text-2xl font-bold text-foreground">{lessonsCompleted}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
