export const dynamic = "force-dynamic"

import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileCheck, Clock, CheckCircle, LogOut } from "lucide-react"
import Link from "next/link"

async function verifyAdmin(sessionToken: string) {
  const sql = neon(process.env.DATABASE_URL!)

  const sessions = await sql`
    SELECT u.id, u.role, u.email 
    FROM sessions s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.token = ${sessionToken} 
    AND s.expires_at > NOW()
    AND u.role = 'admin'
  `

  return sessions.length > 0 ? sessions[0] : null
}

async function getAdminStats() {
  const sql = neon(process.env.DATABASE_URL!)

  const [pendingCount] = await sql`
    SELECT COUNT(*) as count FROM instructors WHERE verification_status = 'under_review'
  `

  const [approvedCount] = await sql`
    SELECT COUNT(*) as count FROM instructors WHERE verification_status = 'approved'
  `

  const [totalInstructors] = await sql`
    SELECT COUNT(*) as count FROM instructors
  `

  const [pendingDocs] = await sql`
    SELECT COUNT(*) as count FROM instructor_documents WHERE status = 'pending'
  `

  return {
    pending: Number(pendingCount?.count || 0),
    approved: Number(approvedCount?.count || 0),
    total: Number(totalInstructors?.count || 0),
    pendingDocs: Number(pendingDocs?.count || 0),
  }
}

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("drivecoach_session")?.value

  if (!sessionToken) {
    redirect("/admin/login")
  }

  const admin = await verifyAdmin(sessionToken)
  if (!admin) {
    redirect("/admin/login")
  }

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {admin.email}</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <Button variant="outline" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Instructors awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved Instructors</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Active on platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Registered on platform</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDocs}</div>
              <p className="text-xs text-muted-foreground">Documents to review</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/admin/verifications">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Instructor Verifications
                </CardTitle>
                <CardDescription>Review and approve instructor documents and applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stats.pending} applications pending review</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/instructors">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Manage Instructors
                </CardTitle>
                <CardDescription>View all instructors and manage their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stats.total} total instructors on platform</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
