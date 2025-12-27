import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { ProgressTrend } from "@/lib/data"

const trendConfig: Record<ProgressTrend, { label: string; icon: typeof TrendingUp; className: string }> = {
  improving: { label: "Improving", icon: TrendingUp, className: "text-success" },
  plateau: { label: "Plateau", icon: Minus, className: "text-warning" },
  declining: { label: "Declining", icon: TrendingDown, className: "text-destructive" },
}

export function ProgressTrendBadge({ trend }: { trend: ProgressTrend }) {
  const config = trendConfig[trend]
  const Icon = config.icon
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", config.className)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}
