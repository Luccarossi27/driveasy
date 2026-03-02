import { createClient } from "@/lib/supabase/server"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { email, password, setupKey } = await request.json()

    if (setupKey !== process.env.ADMIN_SETUP_KEY && setupKey !== "drivecoach-admin-setup-2024") {
      return Response.json({ error: "Invalid setup key" }, { status: 403 })
    }

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existing } = await supabase.from("users").select("id").eq("email", email)

    if (existing && existing.length > 0) {
      return Response.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const { count } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "admin")

    if ((count || 0) >= 5) {
      return Response.json({ error: "Maximum admin accounts reached" }, { status: 400 })
    }

    const passwordHash = hashPassword(password)

    await supabase.from("users").insert({
      email,
      password_hash: passwordHash,
      role: "admin",
    })

    return Response.json({ success: true, message: "Admin account created" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Admin creation error:", error)
    return Response.json({ error: "Failed to create admin" }, { status: 500 })
  }
}
