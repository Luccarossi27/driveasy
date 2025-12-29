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
  const randomNum = Math.floor(Math.random() * 100)
  return `${firstName.toUpperCase()}-${lastName.toUpperCase()}-${randomNum}`
}

export async function verifySession(sessionToken: string) {
  const result = await sql`
    SELECT s.*, u.role, u.email 
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ${sessionToken} AND s.expires_at > NOW()
  `

  if (result.length === 0) {
    return null
  }

  return result[0]
}
