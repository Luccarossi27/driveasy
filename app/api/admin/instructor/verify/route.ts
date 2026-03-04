import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { instructorId, action, rejectionReason } = body

    if (!instructorId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const status = action === "approve" ? "approved" : "rejected"

    await supabase
      .from("instructors")
      .update({
        verification_status: status,
        verification_notes: rejectionReason || null,
        verified_at: action === "approve" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", instructorId)

    // If approved, also approve all pending documents
    if (action === "approve") {
      await supabase
        .from("instructor_documents")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("instructor_id", instructorId)
        .eq("status", "pending")
    }

    // TODO: Send email notification to instructor about approval/rejection

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Instructor verification error:", error)
    return NextResponse.json({ error: "Failed to update instructor" }, { status: 500 })
  }
}
