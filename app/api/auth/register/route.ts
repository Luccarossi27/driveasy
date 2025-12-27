import { neon } from "@neondatabase/serverless"
import { hashPassword, generateSessionToken, generateInstructorCode } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    if (!email || !password || !firstName || !lastName || !role) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return Response.json({ error: "Email already registered" }, { status: 400 })
    }

    const passwordHash = hashPassword(password)

    const userResult =
      await sql`INSERT INTO users (email, password_hash, role) VALUES (${email}, ${passwordHash}, ${role}) RETURNING id`
    const userId = userResult[0].id

    if (role === "instructor") {
      const code = generateInstructorCode(firstName, lastName)
      await sql`INSERT INTO instructors (id, name, email) VALUES (${userId}, ${firstName} || ' ' || ${lastName}, ${email})`
    } else {
      await sql`INSERT INTO students (id, first_name, last_name, email, instructor_id) VALUES (${userId}, ${firstName}, ${lastName}, ${email}, NULL)`
    }

    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await sql`INSERT INTO sessions (user_id, token, expires_at) VALUES (${userId}, ${token}, ${expiresAt})`

    return Response.json(
      {
        success: true,
        role,
        token,
      },
      {
        status: 201,
        headers: {
          "Set-Cookie": `drivecoach_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
        },
      },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error instanceof Error ? error.message : String(error))
    return Response.json({ error: "Registration failed" }, { status: 500 })
  }
}
