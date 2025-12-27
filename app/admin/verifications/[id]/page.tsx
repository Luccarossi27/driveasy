export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Car, Phone, Mail, FileText, Shield } from "lucide-react"
import { DocumentReviewActions } from "@/components/admin/document-review-actions"

async function getInstructorDetails(id: string) {
  const sql = neon(process.env.DATABASE_URL!)

  const [instructor] = await sql`
    SELECT 
      i.*,
      u.email as user_email
    FROM instructors i
    LEFT JOIN users u ON u.id = i.id
    WHERE i.id = ${id}
  `

  if (!instructor) return null

  const documents = await sql`
    SELECT * FROM instructor_documents 
    WHERE instructor_id = ${id}
    ORDER BY document_type
  `

  return { instructor, documents }
}

export default async function InstructorVerificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")?.value

  if (!sessionToken) {
    redirect("/auth/login")
  }

  const data = await getInstructorDetails(id)

  if (!data) {
    notFound()
  }

  const { instructor, documents } = data

  const documentLabels: Record<string, string> = {
    drivers_license: "Driving License",
    adi_license: "ADI License/Badge",
    enhanced_dbs: "Enhanced DBS Certificate",
    right_to_work: "Right to Work Document",
    insurance_certificate: "Insurance Certificate",
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/verifications"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Verifications
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{instructor.name}</h1>
              <p className="text-muted-foreground">Review instructor application</p>
            </div>
            {getStatusBadge(instructor.verification_status)}
          </div>
        </div>

        {/* Instructor Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructor Information</CardTitle>
            <CardDescription>Personal and vehicle details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{instructor.email || instructor.user_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{instructor.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">ADI License</p>
                  <p className="font-medium">{instructor.adi_license_number || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium capitalize">{instructor.car_type || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Number Plate</p>
                  <p className="font-medium">{instructor.number_plate || "Not provided"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
            <CardDescription>Review and approve each document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No documents submitted yet</p>
              ) : (
                documents.map((doc: any) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{documentLabels[doc.document_type] || doc.document_type}</h4>
                        <p className="text-sm text-muted-foreground">{doc.file_name}</p>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                      <div className="flex items-center gap-2">{getStatusBadge(doc.status)}</div>
                    </div>
                    {doc.status === "pending" && (
                      <DocumentReviewActions documentId={doc.id} instructorId={instructor.id} />
                    )}
                    {doc.status === "rejected" && doc.rejection_reason && (
                      <p className="text-sm text-destructive mt-2">Reason: {doc.rejection_reason}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Final Approval */}
        <DocumentReviewActions
          instructorId={instructor.id}
          isFinalApproval
          currentStatus={instructor.verification_status}
        />
      </div>
    </div>
  )
}
