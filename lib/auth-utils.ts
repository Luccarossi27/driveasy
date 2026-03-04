import crypto from "crypto"
import { createClient } from "@/lib/supabase/server"

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function generateInstructorCode(firstName: string, lastName: string): string {
  const firstInitial = firstName.charAt(0).toUpperCase()
  const lastInitial = lastName.charAt(0).toUpperCase()
  const randomNum = Math.floor(Math.random() * 1000000)
  return `${firstInitial}${lastInitial}-${String(randomNum).padStart(6, "0")}`
}

export async function verifySession(sessionToken: string) {
  try {
    const supabase = await createClient()

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id, user_id, expires_at")
      .eq("token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (sessionError || !session) {
      return null
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, role, email")
      .eq("id", session.user_id)
      .single()

    if (userError || !user) {
      return null
    }

    return {
      userId: user.id,
      role: user.role,
      email: user.email,
    }
  } catch (error) {
    console.error("[v0] Session verification error:", error)
    return null
  }
}
