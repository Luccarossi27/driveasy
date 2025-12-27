import { Skeleton } from "@/components/ui/skeleton"

export default function InsightsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl lg:col-span-1" />
      </div>
    </div>
  )
}
