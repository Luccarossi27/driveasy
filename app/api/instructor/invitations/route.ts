import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { verifySession } from "@/lib/auth-utils"
import crypto from "crypto"

// GET - Fetch instructor's invitations
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await verifySession(sessionToken)
    if (!session || session.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    // Get instructor
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id, instructor_code")
      .eq("user_id", session.userId)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    // Fetch invitations
    const { data: invitations } = await supabase
      .from("student_invitations")
      .select("id, student_email, status, created_at, accepted_at, expires_at")
      .eq("instructor_id", instructor.id)
      .order("created_at", { ascending: false })
      .limit(20)

    return NextResponse.json({
      invitations: invitations || [],
      instructorCode: instructor.instructor_code,
    })
  } catch (error) {
    console.error("Fetch invitations error:", error)
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 })
  }
}

// POST - Send new invitation
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await verifySession(sessionToken)
    if (!session || session.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentEmail } = await request.json()

    if (!studentEmail) {
      return NextResponse.json({ error: "Student email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get instructor ID
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id")
      .eq("user_id", session.userId)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    // Generate unique invitation code
    const invitationCode = crypto.randomBytes(16).toString("hex")

    // Create or update invitation
    const { error } = await supabase
      .from("student_invitations")
      .upsert({
        instructor_id: instructor.id,
        student_email: studentEmail.toLowerCase(),
        invitation_code: invitationCode,
        status: "pending",
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: "instructor_id,student_email",
      })

    if (error) {
      console.error("Invitation error:", error)
      return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent",
      invitationCode,
    })
  } catch (error) {
    console.error("Send invitation error:", error)
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }
}
