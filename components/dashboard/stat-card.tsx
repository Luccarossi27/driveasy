import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "warning" | "success"
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold",
              variant === "primary" && "text-primary",
              variant === "warning" && "text-warning",
              variant === "success" && "text-success",
              variant === "default" && "text-foreground",
            )}
          >
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-1 text-xs", trend.isPositive ? "text-success" : "text-destructive")}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "success" && "bg-success/10 text-success",
            variant === "default" && "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
