import { createClient } from "@/lib/supabase/server"
import { hashPassword, generateSessionToken, generateInstructorCode } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    if (!email || !password || !firstName || !lastName || !role) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email)

    if (existingUser && existingUser.length > 0) {
      return Response.json({ error: "Email already registered" }, { status: 400 })
    }

    const passwordHash = hashPassword(password)

    const { data: userResult, error: userError } = await supabase
      .from("users")
      .insert({ email, password_hash: passwordHash, role })
      .select("id")
      .single()

    if (userError || !userResult) {
      throw new Error("Failed to create user")
    }

    const userId = userResult.id

    if (role === "instructor") {
      const code = generateInstructorCode(firstName, lastName)
      await supabase.from("instructors").insert({
        id: userId,
        name: `${firstName} ${lastName}`,
        email,
        instructor_code: code,
      })
    } else {
      await supabase.from("students").insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        instructor_id: null,
      })
    }

    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await supabase.from("sessions").insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    })

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
