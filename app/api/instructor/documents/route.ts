import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("drivecoach_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get session
    const { data: session } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("token", sessionToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Get instructor
    const { data: instructor } = await supabase
      .from("instructors")
      .select("id")
      .eq("user_id", session.user_id)
      .single()

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    const body = await request.json()
    const { vehicleInfo, documents } = body

    // Update instructor with vehicle info
    await supabase
      .from("instructors")
      .update({
        car_type: vehicleInfo.carType,
        number_plate: vehicleInfo.numberPlate,
        adi_license_number: vehicleInfo.adiLicenseNumber,
        phone: vehicleInfo.phone,
        verification_status: "under_review",
        updated_at: new Date().toISOString(),
      })
      .eq("id", instructor.id)

    // Insert/update documents
    for (const doc of documents) {
      await supabase.from("instructor_documents").upsert(
        {
          instructor_id: instructor.id,
          document_type: doc.document_type,
          file_url: doc.file_url,
          file_name: doc.file_name,
          file_size: doc.file_size,
          status: "pending",
          uploaded_at: new Date().toISOString(),
        },
        { onConflict: "instructor_id,document_type" }
      )
    }

    return NextResponse.json({ success: true, message: "Documents submitted for review" })
  } catch (error) {
    console.error("Document submission error:", error)
    return NextResponse.json({ error: "Failed to submit documents" }, { status: 500 })
  }
}
