import { headers, cookies } from "next/headers"
import { unstable_noStore } from "next/cache"
import PaymentsPageClient from "@/components/portal/payments-page-client"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const revalidate = 0

export default async function PaymentsPage() {
  unstable_noStore()
  await headers()
  await cookies()

  return <PaymentsPageClient />
}
