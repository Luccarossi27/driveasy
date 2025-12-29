"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DriveasyLogo } from "@/components/driveasy-logo"
import { Loader2, CheckCircle2, User, Star, Car } from "lucide-react"

interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  carType: string
  rating: number
  passRate: number
}

export function JoinPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [instructorCode, setInstructorCode] = useState("")
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    const code = searchParams.get("instructor") || searchParams.get("code")
    if (code) {
      setInstructorCode(code)
      lookupInstructor(code)
    }
  }, [searchParams])

  const lookupInstructor = async (code: string) => {
    if (!code.trim()) return

    setLoading(true)
    setError("")
    setInstructor(null)

    try {
      const res = await fetch(`/api/instructor/lookup?code=${encodeURIComponent(code)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Instructor not found")
        return
      }

      setInstructor(data.instructor)
    } catch (err) {
      setError("Failed to look up instructor. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!instructor) return

    setJoining(true)
    setError("")

    try {
      const res = await fetch("/api/student/join-instructor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructorId: instructor.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.requiresAuth) {
          router.push(`/auth/register/student?instructor=${instructor.id}`)
          return
        }
        setError(data.error || "Failed to join instructor")
        return
      }

      setJoined(true)
      setTimeout(() => {
        router.push("/portal")
      }, 2000)
    } catch (err) {
      setError("Failed to join instructor. Please try again.")
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <DriveasyLogo size="lg" />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Join Your Instructor</CardTitle>
            <CardDescription>Enter your instructor's code to connect with them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!instructor && !joined && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instructor Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., JOHN-SMITH-42"
                      value={instructorCode}
                      onChange={(e) => setInstructorCode(e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                    <Button
                      onClick={() => lookupInstructor(instructorCode)}
                      disabled={loading || !instructorCode.trim()}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
                    </Button>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <p className="text-xs text-muted-foreground text-center">
                  Don't have a code? Ask your driving instructor for their unique code.
                </p>
              </>
            )}

            {instructor && !joined && (
              <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{instructor.name}</p>
                      <p className="text-sm text-muted-foreground">Verified Instructor</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{instructor.carType || "Manual"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      <span>{instructor.passRate || 85}% pass rate</span>
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button onClick={handleJoin} className="w-full" disabled={joining}>
                  {joining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join This Instructor"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setInstructor(null)
                    setInstructorCode("")
                  }}
                >
                  Search for Different Instructor
                </Button>
              </div>
            )}

            {joined && (
              <div className="text-center space-y-3 py-4">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
                <p className="font-semibold">Successfully Joined!</p>
                <p className="text-sm text-muted-foreground">Redirecting to your portal...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          New to Driveasy?{" "}
          <a href="/auth" className="text-primary hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}
