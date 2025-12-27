import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from session
    const sessions = await sql`
      SELECT user_id FROM sessions WHERE token = ${sessionToken} AND expires_at > NOW()
    `

    if (sessions.length === 0) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const userId = sessions[0].user_id

    // Get instructor ID
    const instructors = await sql`
      SELECT id FROM instructors WHERE id = ${userId}
    `

    if (instructors.length === 0) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const instructorId = instructors[0].id
    const body = await request.json()
    const { vehicleInfo, documents } = body

    // Update instructor with vehicle info
    await sql`
      UPDATE instructors 
      SET 
        car_type = ${vehicleInfo.carType},
        number_plate = ${vehicleInfo.numberPlate},
        adi_license_number = ${vehicleInfo.adiLicenseNumber},
        phone = ${vehicleInfo.phone},
        verification_status = 'under_review',
        updated_at = NOW()
      WHERE id = ${instructorId}
    `

    // Insert documents
    for (const doc of documents) {
      await sql`
        INSERT INTO instructor_documents (instructor_id, document_type, file_url, file_name, file_size, status)
        VALUES (${instructorId}, ${doc.document_type}, ${doc.file_url}, ${doc.file_name}, ${doc.file_size}, 'pending')
        ON CONFLICT (instructor_id, document_type) 
        DO UPDATE SET 
          file_url = ${doc.file_url},
          file_name = ${doc.file_name},
          file_size = ${doc.file_size},
          status = 'pending',
          uploaded_at = NOW()
      `
    }

    return NextResponse.json({ success: true, message: "Documents submitted for review" })
  } catch (error) {
    console.error("Document submission error:", error)
    return NextResponse.json({ error: "Failed to submit documents" }, { status: 500 })
  }
}
