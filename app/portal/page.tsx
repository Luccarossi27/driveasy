import { cookies, headers } from "next/headers"
import { unstable_noStore as noStore } from "next/cache"
import StudentPortalClient from "@/components/portal/student-portal-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function StudentPortalPage() {
  noStore()

  const headersList = await headers()
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  return <StudentPortalClient hasSession={!!session} />
}
