export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Car, Calendar } from "lucide-react"

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

async function getAllInstructors() {
  const supabase = await createClient()

  const { data: instructors } = await supabase
    .from("instructors")
    .select("id, phone, car_type, number_plate, adi_license_number, verification_status, created_at, user_id")
    .order("verification_status", { ascending: false })
    .order("created_at", { ascending: false })

  if (!instructors) return []

  // Get user details for each instructor
  const enrichedInstructors = await Promise.all(
    instructors.map(async (instructor) => {
      const { data: user } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", instructor.user_id)
        .single()

      return {
        ...instructor,
        name: user?.name || "Unknown",
        email: user?.email || "",
      }
    })
  )

  return enrichedInstructors
}

export default async function ManageInstructorsPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("drivecoach_session")?.value

  if (!sessionToken) {
    redirect("/admin/login")
  }

  const isAdmin = await verifyAdmin(sessionToken)
  if (!isAdmin) {
    redirect("/admin/login")
  }

  const instructors = await getAllInstructors()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "under_review":
        return "Under Review"
      case "pending":
        return "Pending"
      default:
        return status
    }
  }

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
          <h1 className="text-3xl font-bold">Manage Instructors</h1>
          <p className="text-muted-foreground">View all registered instructors and their details</p>
        </div>

        {instructors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No instructors found</p>
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
                        <Badge className={getStatusColor(instructor.verification_status)}>
                          {getStatusLabel(instructor.verification_status)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {instructor.adi_license_number || "No ADI License"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{instructor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{instructor.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Car className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{instructor.car_type || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Registered</p>
                        <p className="font-medium">{new Date(instructor.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  {instructor.number_plate && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Number Plate:</span>{" "}
                        <span className="font-medium">{instructor.number_plate}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
