"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Car, Calendar, Shield, Bell, LogOut, ChevronRight, Check, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  joinedDate?: string
  licenceNumber?: string
  theoryTestPassed?: boolean
  practicalTestDate?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState({
    lessonReminders: true,
    progressUpdates: true,
    paymentReminders: true,
    promotions: false,
  })
  const [saved, setSaved] = useState(false)

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

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const studentName = student?.name || "Student"
  const studentEmail = student?.email || ""
  const studentPhone = student?.phone || ""
  const joinedDate = student?.joinedDate || new Date().toISOString()
  const licenceNumber = student?.licenceNumber || ""
  const theoryTestPassed = student?.theoryTestPassed || false
  const practicalTestDate = student?.practicalTestDate

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {studentName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <h2 className="text-xl font-bold text-foreground">{studentName}</h2>
        <p className="text-muted-foreground">
          Student since {new Date(joinedDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
            <Input defaultValue={studentName} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input type="email" defaultValue={studentEmail} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
            <Input type="tel" defaultValue={studentPhone} />
          </div>
          <Button onClick={handleSave} className="w-full">
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Driving Details */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Car className="h-5 w-5 text-primary" />
          Driving Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Provisional Licence</span>
            <span className="font-medium text-foreground">{licenceNumber || "Not provided"}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-muted-foreground">Theory Test</span>
            <span className={theoryTestPassed ? "font-medium text-success" : "font-medium text-warning"}>
              {theoryTestPassed ? "Passed" : "Not yet"}
            </span>
          </div>
          {practicalTestDate && (
            <div className="flex items-center justify-between py-2 border-t border-border">
              <span className="text-muted-foreground">Practical Test Date</span>
              <span className="font-medium text-foreground">
                {new Date(practicalTestDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Lesson Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminded before lessons</p>
            </div>
            <Switch
              checked={notifications.lessonReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, lessonReminders: checked })}
            />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="font-medium text-foreground">Progress Updates</p>
              <p className="text-sm text-muted-foreground">Summaries after lessons</p>
            </div>
            <Switch
              checked={notifications.progressUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, progressUpdates: checked })}
            />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="font-medium text-foreground">Payment Reminders</p>
              <p className="text-sm text-muted-foreground">Outstanding balance alerts</p>
            </div>
            <Switch
              checked={notifications.paymentReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, paymentReminders: checked })}
            />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="font-medium text-foreground">Promotions</p>
              <p className="text-sm text-muted-foreground">Offers and special deals</p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
            />
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <button className="flex items-center justify-between w-full px-5 py-4 hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Change Password</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="flex items-center justify-between w-full px-5 py-4 hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Download My Data</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center justify-between w-full px-5 py-4 hover:bg-destructive/5 transition-colors text-destructive"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
