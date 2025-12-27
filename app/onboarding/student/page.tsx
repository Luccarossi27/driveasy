"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StudentOnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    phone: "",
    instructorCode: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleNext() {
    setLoading(true)
    try {
      // Save student profile and connect to instructor if code provided
      router.push("/portal")
    } catch (err) {
      setError("Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit about your driving journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+44 7123 456789"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructorCode">Instructor Code (Optional)</Label>
            <Input
              id="instructorCode"
              name="instructorCode"
              placeholder="E.g., JOHN-SMITH-42"
              value={formData.instructorCode}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">You can add an instructor later if you don't have one yet</p>
          </div>

          <Button onClick={handleNext} className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Get Started"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
