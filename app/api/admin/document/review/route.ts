import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()
    const { documentId, action, rejectionReason } = body

    if (!documentId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const status = action === "approve" ? "approved" : "rejected"

    await sql`
      UPDATE instructor_documents 
      SET 
        status = ${status},
        rejection_reason = ${rejectionReason || null},
        reviewed_at = NOW()
      WHERE id = ${documentId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Document review error:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}
