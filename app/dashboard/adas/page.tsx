import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { ADASContent } from "@/components/dashboard/adas-content"

export default function ADASPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ADASContent />
    </Suspense>
  )
}
