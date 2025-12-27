import crypto from "crypto"

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
