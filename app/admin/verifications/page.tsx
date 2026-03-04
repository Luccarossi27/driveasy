export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Clock, Car } from "lucide-react"

async function verifyAdmin(sessionToken: string) {
  const supabase = await createClient()

  const { data: session } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("token", sessionToken)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (!session) return false

  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user_id)
    .eq("role", "admin")
    .single()

  return !!user
}

async function getPendingInstructors() {
  const supabase = await createClient()

  const { data: instructors } = await supabase
    .from("instructors")
    .select("id, phone, car_type, number_plate, adi_license_number, verification_status, created_at, user_id")
    .in("verification_status", ["under_review", "pending"])
    .order("created_at", { ascending: false })

  if (!instructors) return []

  // Get user details and document counts for each instructor
  const enrichedInstructors = await Promise.all(
    instructors.map(async (instructor) => {
      const { data: user } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", instructor.user_id)
        .single()

      const { count: docCount } = await supabase
        .from("instructor_documents")
        .select("*", { count: "exact", head: true })
        .eq("instructor_id", instructor.id)

      const { count: pendingDocs } = await supabase
        .from("instructor_documents")
        .select("*", { count: "exact", head: true })
        .eq("instructor_id", instructor.id)
        .eq("status", "pending")

      return {
        ...instructor,
        name: user?.name || "Unknown",
        email: user?.email || "",
        doc_count: docCount || 0,
        pending_docs: pendingDocs || 0,
      }
    })
  )

  return enrichedInstructors
}

export default async function VerificationsPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("drivecoach_session")?.value

  if (!sessionToken) {
    redirect("/admin/login")
  }

  const isAdmin = await verifyAdmin(sessionToken)
  if (!isAdmin) {
    redirect("/admin/login")
  }

  const instructors = await getPendingInstructors()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Instructor Verifications</h1>
          <p className="text-muted-foreground">Review and approve instructor applications</p>
        </div>

        {instructors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No pending verifications</h3>
              <p className="text-muted-foreground">All instructor applications have been reviewed</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {instructors.map((instructor) => (
              <Card key={instructor.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {instructor.name}
                        <Badge variant={instructor.verification_status === "under_review" ? "default" : "secondary"}>
                          {instructor.verification_status === "under_review" ? "Under Review" : "Pending"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{instructor.email}</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href={`/admin/verifications/${instructor.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{instructor.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vehicle Type</p>
                      <p className="font-medium flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {instructor.car_type || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Number Plate</p>
                      <p className="font-medium">{instructor.number_plate || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Documents</p>
                      <p className="font-medium">
                        {instructor.pending_docs} / {instructor.doc_count} pending
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
