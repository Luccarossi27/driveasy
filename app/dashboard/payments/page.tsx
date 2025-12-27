import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { PaymentsContent } from "@/components/dashboard/payments-content"

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentsContent />
    </Suspense>
  )
}
