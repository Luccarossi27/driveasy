import crypto from "crypto"
import { sql } from "@/lib/db"

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
  // Use 6-digit random number for much better uniqueness (0-999999)
  const randomNum = Math.floor(Math.random() * 1000000)
  return `${firstInitial}${lastInitial}-${String(randomNum).padStart(6, "0")}`
}

export async function verifySession(sessionToken: string) {
  const result = await sql`
    SELECT s.*, u.role, u.email, u.id as userId
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ${sessionToken} AND s.expires_at > NOW()
  `

  if (result.length === 0) {
    console.log("[v0] Session verification failed: session not found or expired")
    return null
  }

  console.log("[v0] Session verified for user:", result[0].userId, "role:", result[0].role)
  return {
    userId: result[0].userId,
    role: result[0].role,
    email: result[0].email,
  }
}
