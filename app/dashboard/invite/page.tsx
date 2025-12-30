"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Share2, Copy, CheckCircle2, Loader2 } from "lucide-react"

interface Invitation {
  id: string
  student_email: string
  status: string
  created_at: string
  accepted_at: string | null
}

export default function InvitePage() {
  const [studentEmail, setStudentEmail] = useState("")
  const [isSending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [instructorId, setInstructorId] = useState("")
  const [instructorName, setInstructorName] = useState("")
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch("/api/instructor/profile")
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setInstructorId(profileData.instructor?.id || "")
          setInstructorName(profileData.instructor?.name || "")
        }

        // Fetch invitations
        const invRes = await fetch("/api/instructor/invitations")
        if (invRes.ok) {
          const invData = await invRes.json()
          setInvitations(invData.invitations || [])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?instructor=${instructorId}`
      : `/join?instructor=${instructorId}`

  const handleSendInvite = async () => {
    if (!studentEmail) return
    setSending(true)

    try {
      const res = await fetch("/api/instructor/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentEmail }),
      })

      if (res.ok) {
        setSentSuccess(true)
        // Refresh invitations list
        const invRes = await fetch("/api/instructor/invitations")
        if (invRes.ok) {
          const invData = await invRes.json()
          setInvitations(invData.invitations || [])
        }
        setTimeout(() => {
          setSentSuccess(false)
          setStudentEmail("")
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to send invite:", error)
    } finally {
      setSending(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Invite Students</h1>
        <p className="text-muted-foreground">Share your unique link with students to connect with them</p>
      </div>

      <Tabs defaultValue="link" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="link" className="data-[state=active]:bg-card">
            <Share2 className="mr-2 h-4 w-4" />
            Shareable Link
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-card">
            <Mail className="mr-2 h-4 w-4" />
            Send Email Invite
          </TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Link Sharing */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Your Unique Invite Link
              </h2>
              <p className="text-sm text-muted-foreground">
                Share this link with students. When they click it, they'll see your profile and can join you directly -
                no code entry needed!
              </p>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Your Link</p>
                <div className="relative">
                  <Input
                    type="text"
                    value={instructorId ? inviteLink : "Loading..."}
                    readOnly
                    className="bg-card font-mono text-sm pr-20"
                  />
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    disabled={!instructorId}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Quick Share:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="bg-card"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(`Join me for driving lessons on Driveasy: ${inviteLink}`)}`,
                      )
                    }
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-card"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `mailto:?subject=Join my driving lessons&body=${encodeURIComponent(`Hi!\n\nI'd like to invite you to join my driving lessons on Driveasy.\n\nClick here to connect with me: ${inviteLink}\n\nSee you soon!`)}`,
                      )
                    }
                  >
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-card"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Join my driving lessons",
                          text: "Join me for driving lessons on Driveasy",
                          url: inviteLink,
                        })
                      }
                    }}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Share your link</p>
                    <p className="text-sm text-muted-foreground">Send via WhatsApp, SMS, email or any messenger</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Student clicks the link</p>
                    <p className="text-sm text-muted-foreground">
                      They see your profile with credentials and pass rate
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Student joins</p>
                    <p className="text-sm text-muted-foreground">
                      They create an account (if needed) and connect to you
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-sm font-semibold text-success shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Connected!</p>
                    <p className="text-sm text-muted-foreground">They appear in your student list automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Email Invite */}
        <TabsContent value="email" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Send Invite Form */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Send Direct Invite
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your student's email address and they'll receive an invitation to join your dashboard
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student Email Address</label>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="bg-secondary"
                />
              </div>

              <Button onClick={handleSendInvite} disabled={!studentEmail || isSending} className="w-full">
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : sentSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Invite Sent!
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invite
                  </>
                )}
              </Button>

              <div className="p-4 bg-success/5 border border-success/30 rounded-lg">
                <p className="text-sm text-success font-medium">What happens next?</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Student receives email invite with your link</li>
                  <li>• They create their account and verify email</li>
                  <li>• They're automatically linked to your dashboard</li>
                </ul>
              </div>
            </div>

            {/* Recent Invites */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Invitations</h3>
              <div className="space-y-3">
                {invitations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No invitations sent yet</p>
                ) : (
                  invitations.slice(0, 5).map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{inv.student_email}</p>
                        <p className="text-xs text-muted-foreground">Sent {formatDate(inv.created_at)}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          inv.status === "accepted" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}
                      >
                        {inv.status === "accepted" ? "Accepted" : "Pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
