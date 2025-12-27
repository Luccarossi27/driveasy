import { cn } from "@/lib/utils"
import type { StudentStatus } from "@/lib/data"

const statusConfig: Record<StudentStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
  active: { label: "Active", className: "bg-primary/10 text-primary border-primary/20" },
  "test-booked": { label: "Test Booked", className: "bg-warning/10 text-warning border-warning/20" },
  passed: { label: "Passed", className: "bg-success/10 text-success border-success/20" },
}

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", config.className)}
    >
      {config.label}
    </span>
  )
}
