import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { AIInsightsContent } from "@/components/dashboard/ai-insights-content"

export default function AIInsightsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AIInsightsContent />
    </Suspense>
  )
}
