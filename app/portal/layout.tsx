import type React from "react"
import Link from "next/link"
import { Car, Home, Calendar, History, CreditCard, Users, User, LogOut } from "lucide-react"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: "/portal", icon: Home, label: "Dashboard" },
    { href: "/portal/book", icon: Calendar, label: "Book Lesson" },
    { href: "/portal/history", icon: History, label: "Lesson History" },
    { href: "/portal/payments", icon: CreditCard, label: "Payments" },
    { href: "/portal/refer", icon: Users, label: "Refer a Friend" },
    { href: "/portal/profile", icon: User, label: "Profile" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">DriveCoach</span>
          </Link>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            ET
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">DriveCoach</span>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-secondary/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                ET
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">Emma Thompson</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-4xl p-4 pb-24 lg:p-8 lg:pb-8">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:hidden z-50">
          <div className="grid grid-cols-5 h-16">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
