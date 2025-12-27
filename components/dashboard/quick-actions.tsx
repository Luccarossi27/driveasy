"use client"

import { Button } from "@/components/ui/button"
import { FileText, CreditCard, Sparkles, UserPlus } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-foreground">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
          <Link href="/dashboard/insights">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs">Add Lesson Note</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
          <Link href="/dashboard/payments">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="text-xs">Take Payment</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
          <Link href="/dashboard/insights">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-xs">Generate Summary</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
          <Link href="/dashboard/students/new">
            <UserPlus className="h-5 w-5 text-primary" />
            <span className="text-xs">Add Student</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
