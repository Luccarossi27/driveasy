"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("[v0] Starting login for:", email)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("[v0] Login response status:", response.status)
      const data = await response.json()
      console.log("[v0] Login response data:", data)

      if (!response.ok) {
        setError(data.error || "Login failed")
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 100))

      // Redirect based on user role
      if (data.role === "instructor") {
        console.log("[v0] Redirecting to instructor dashboard")
        router.push("/dashboard")
      } else {
        console.log("[v0] Redirecting to student portal")
        router.push("/portal")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("[v0] Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your DriveCoach account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth" className="text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
