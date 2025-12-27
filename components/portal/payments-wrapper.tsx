"use client"

import dynamic from "next/dynamic"

// Dynamic import with ssr: false must be in a client component
const StudentPaymentsClient = dynamic(() => import("@/components/portal/student-payments-client"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
})

export default function PaymentsWrapper() {
  return <StudentPaymentsClient />
}
