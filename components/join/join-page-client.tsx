"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DriveasyLogo } from "@/components/driveasy-logo"
import { Loader2, CheckCircle2, User, Star, Car, ShieldCheck } from "lucide-react"

interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  carType: string
  passRate: number
  verified: boolean
}

export function JoinPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    const instructorId = searchParams.get("instructor")
    const code = searchParams.get("code")

    if (instructorId || code) {
      lookupInstructor(instructorId, code)
    } else {
      setLoading(false)
      setError("Invalid invite link. Please ask your instructor for a new link.")
    }
  }, [searchParams])

  const lookupInstructor = async (instructorId: string | null, code: string | null) => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (instructorId) params.set("instructor", instructorId)
      if (code) params.set("code", code)

      const res = await fetch(`/api/instructor/lookup?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Instructor not found")
        return
      }

      setInstructor(data.instructor)
    } catch (err) {
      setError("Failed to load instructor details. Please try again.")
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
          // Redirect to registration with instructor ID pre-filled
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <DriveasyLogo size="lg" />
          <div className="space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading instructor details...</p>
          </div>
        </div>
      </div>
    )
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
            <CardDescription>{instructor ? `Connect with ${instructor.name}` : "Something went wrong"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && !instructor && (
              <div className="text-center space-y-4">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" onClick={() => router.push("/auth")}>
                  Go to Sign Up
                </Button>
              </div>
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
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {instructor.verified && (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-success" />
                            <span className="text-success">Verified Instructor</span>
                          </>
                        )}
                        {!instructor.verified && <span>Instructor</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{instructor.carType || "Manual"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      <span>{instructor.passRate}% pass rate</span>
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

                <p className="text-xs text-center text-muted-foreground">
                  By joining, you'll be able to book lessons and track your progress with this instructor.
                </p>
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
          <a
            href={`/auth/register/student${instructor ? `?instructor=${instructor.id}` : ""}`}
            className="text-primary hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}
