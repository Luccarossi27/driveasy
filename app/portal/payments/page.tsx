import { headers, cookies } from "next/headers"
import { unstable_noStore } from "next/cache"
import PaymentsWrapper from "@/components/portal/payments-wrapper"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const revalidate = 0

export default async function PaymentsPage() {
  unstable_noStore()

  // Reading headers and cookies forces Next.js to skip static generation
  await headers()
  await cookies()

  return <PaymentsWrapper />
}
