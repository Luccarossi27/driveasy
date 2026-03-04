import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { documentId, action, rejectionReason } = body

    if (!documentId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const status = action === "approve" ? "approved" : "rejected"

    await supabase
      .from("instructor_documents")
      .update({
        status,
        rejection_reason: rejectionReason || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", documentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Document review error:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}
