import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
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

    // Get instructor ID
    const instructorResult = await sql`
      SELECT id, instructor_code FROM instructors WHERE user_id = ${session.userId}
    `

    if (instructorResult.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructor = instructorResult[0]

    // Fetch invitations
    const invitations = await sql`
      SELECT id, student_email, status, created_at, accepted_at, expires_at
      FROM student_invitations
      WHERE instructor_id = ${instructor.id}
      ORDER BY created_at DESC
      LIMIT 20
    `

    return NextResponse.json({
      invitations,
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

    // Get instructor ID
    const instructorResult = await sql`
      SELECT id FROM instructors WHERE user_id = ${session.userId}
    `

    if (instructorResult.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructorId = instructorResult[0].id

    // Generate unique invitation code
    const invitationCode = crypto.randomBytes(16).toString("hex")

    // Create invitation
    await sql`
      INSERT INTO student_invitations (instructor_id, student_email, invitation_code)
      VALUES (${instructorId}, ${studentEmail.toLowerCase()}, ${invitationCode})
      ON CONFLICT (instructor_id, student_email) 
      DO UPDATE SET 
        invitation_code = ${invitationCode},
        status = 'pending',
        created_at = NOW(),
        expires_at = NOW() + INTERVAL '30 days'
    `

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
