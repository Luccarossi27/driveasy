"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DriveasyLogo } from "@/components/driveasy-logo"

export default function AuthPage() {
  const router = useRouter()
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <DriveasyLogo size="lg" />
          </div>
          <p className="text-lg text-muted-foreground">Smart Platform for Driving Instructors & Students</p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Instructor Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              hoveredRole === "instructor"
                ? "border-primary shadow-lg scale-105"
                : "border-border hover:border-primary/50"
            }`}
            onMouseEnter={() => setHoveredRole("instructor")}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <CardHeader>
              <CardTitle className="text-2xl">For Instructors</CardTitle>
              <CardDescription>Manage your students and grow your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Track student progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Manage lesson schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Generate skill assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Track payments and reviews</span>
                </li>
              </ul>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full" variant="default">
                  <Link href="/auth/register/instructor">Sign Up as Instructor</Link>
                </Button>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/auth/login">Already have an account?</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              hoveredRole === "student" ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/50"
            }`}
            onMouseEnter={() => setHoveredRole("student")}
            onMouseLeave={() => setHoveredRole(null)}
          >
            <CardHeader>
              <CardTitle className="text-2xl">For Students</CardTitle>
              <CardDescription>Track your progress and ace your test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>View lesson feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Track your progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Book lessons online</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Connect with your instructor</span>
                </li>
              </ul>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full" variant="default">
                  <Link href="/auth/register/student">Sign Up as Student</Link>
                </Button>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/auth/login">Already have an account?</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
