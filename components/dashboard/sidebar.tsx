"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Brain,
  Car,
  Trophy,
  Star,
  CreditCard,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/insights", label: "Insights", icon: Brain },
  { href: "/dashboard/adas", label: "ADAS Training", icon: Car },
  { href: "/dashboard/reputation", label: "Reputation", icon: Trophy },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/invite", label: "Invite Students", icon: Send },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0 lg:flex",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">DriveCoach</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
              <UserCircle className="h-5 w-5 text-sidebar-foreground" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-sidebar-foreground">Mike Harrison</p>
              <p className="text-xs text-sidebar-foreground/60">Instructor</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Link href="/dashboard/settings" className="flex-1">
              <Button variant="ghost" size="sm" className="flex-1 justify-start text-sidebar-foreground/70">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/70">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
