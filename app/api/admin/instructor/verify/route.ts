import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()
    const { instructorId, action, rejectionReason } = body

    if (!instructorId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const status = action === "approve" ? "approved" : "rejected"

    await sql`
      UPDATE instructors 
      SET 
        verification_status = ${status},
        verification_notes = ${rejectionReason || null},
        verified_at = ${action === "approve" ? new Date().toISOString() : null},
        updated_at = NOW()
      WHERE id = ${instructorId}
    `

    // If approved, also approve all pending documents
    if (action === "approve") {
      await sql`
        UPDATE instructor_documents 
        SET status = 'approved', reviewed_at = NOW()
        WHERE instructor_id = ${instructorId} AND status = 'pending'
      `
    }

    // TODO: Send email notification to instructor about approval/rejection

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Instructor verification error:", error)
    return NextResponse.json({ error: "Failed to update instructor" }, { status: 500 })
  }
}
