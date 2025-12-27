import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="min-h-screen p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
