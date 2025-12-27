import { neon } from "@neondatabase/serverless"
import { hashPassword } from "@/lib/auth-utils"

// This endpoint creates the first admin account
// In production, you should secure this or remove it after setup
export async function POST(request: Request) {
  try {
    const { email, password, setupKey } = await request.json()

    // Simple setup key protection - change this in production
    if (setupKey !== process.env.ADMIN_SETUP_KEY && setupKey !== "drivecoach-admin-setup-2024") {
      return Response.json({ error: "Invalid setup key" }, { status: 403 })
    }

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if admin already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return Response.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Check how many admins exist
    const adminCount = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`
    if (Number(adminCount[0]?.count) >= 5) {
      return Response.json({ error: "Maximum admin accounts reached" }, { status: 400 })
    }

    const passwordHash = hashPassword(password)

    await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${email}, ${passwordHash}, 'admin')
    `

    return Response.json({ success: true, message: "Admin account created" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Admin creation error:", error)
    return Response.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
