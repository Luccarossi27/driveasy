"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewStudentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard/students")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/students">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Student</h1>
          <p className="text-muted-foreground">Enter the student's details to get started</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h2 className="font-semibold text-foreground">Personal Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" required className="bg-secondary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Smith" required className="bg-secondary" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required className="bg-secondary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="07700 123456" required className="bg-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licence">Provisional Licence Number (Optional)</Label>
            <Input id="licence" placeholder="SMITH901234AB5CD" className="bg-secondary" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h2 className="font-semibold text-foreground">Learning Status</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theoryStatus">Theory Test Status</Label>
              <Select>
                <SelectTrigger id="theoryStatus" className="bg-secondary">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-booked">Not Booked</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Previous Experience</Label>
              <Select>
                <SelectTrigger id="experience" className="bg-secondary">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Complete Beginner</SelectItem>
                  <SelectItem value="some">Some Lessons</SelectItem>
                  <SelectItem value="experienced">Experienced (Previous Test)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral">Referred By (Optional)</Label>
            <Input id="referral" placeholder="Friend's name or how they found you" className="bg-secondary" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/students">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Student"}
          </Button>
        </div>
      </form>
    </div>
  )
}
