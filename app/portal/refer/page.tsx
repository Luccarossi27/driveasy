"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Gift, Copy, Check, Mail, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const referralCode = "EMMA20"
const referralLink = "https://drivecoach.app/r/EMMA20"

const referralHistory = [
  { id: "1", name: "Sarah M.", status: "completed", reward: 20, date: "2024-11-15" },
  { id: "2", name: "Tom B.", status: "pending", reward: 20, date: "2024-12-10" },
]

export default function ReferPage() {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = () => {
    if (email) {
      setEmailSent(true)
      setEmail("")
      setTimeout(() => setEmailSent(false), 3000)
    }
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Refer a Friend</h1>
        <p className="text-muted-foreground mt-1">Share the love and earn rewards</p>
      </div>

      {/* Reward Banner */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Give £20, Get £20</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          When your friend books their first lesson, you both get £20 off your next lesson!
        </p>
      </div>

      {/* Referral Code */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-3">Your Referral Code</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-center">
            <span className="text-2xl font-bold tracking-wider text-primary">{referralCode}</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Share Link */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-3">Share Your Link</h3>
        <div className="flex items-center gap-2 mb-4">
          <Input value={referralLink} readOnly className="bg-secondary" />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <a
              href={`https://wa.me/?text=Learn%20to%20drive%20with%20my%20instructor!%20Use%20my%20code%20${referralCode}%20for%20%C2%A320%20off%20your%20first%20lesson!%20${referralLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <a
              href={`mailto:?subject=Learn%20to%20drive%20with%20my%20instructor&body=Use%20my%20code%20${referralCode}%20for%20%C2%A320%20off%20your%20first%20lesson!%20${referralLink}`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </a>
          </Button>
        </div>
      </div>

      {/* Send Invite */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-3">Send an Invite</h3>
        <div className="flex items-center gap-2">
          <Input type="email" placeholder="friend@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleSendEmail} disabled={!email}>
            {emailSent ? <Check className="h-5 w-5" /> : "Send"}
          </Button>
        </div>
        {emailSent && <p className="text-sm text-success mt-2">Invite sent successfully!</p>}
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-foreground">1</p>
          <p className="text-sm text-muted-foreground">Successful Referrals</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-primary">£20</p>
          <p className="text-sm text-muted-foreground">Total Earned</p>
        </div>
      </div>

      {/* Referral History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Your Referrals
          </h3>
        </div>
        <div className="divide-y divide-border">
          {referralHistory.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {referral.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{referral.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(referral.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                    referral.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
                  )}
                >
                  {referral.status === "completed" ? "Completed" : "Pending"}
                </span>
                <p className="text-sm font-semibold text-foreground mt-1">£{referral.reward}</p>
              </div>
            </div>
          ))}
          {referralHistory.length === 0 && (
            <div className="px-5 py-8 text-center text-muted-foreground">
              No referrals yet. Share your code to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
