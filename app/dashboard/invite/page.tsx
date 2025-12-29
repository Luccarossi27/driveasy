"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Share2, Copy, CheckCircle2, Users, Loader2 } from "lucide-react"

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
  const [instructorCode, setInstructorCode] = useState("")
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch instructor code
        const codeRes = await fetch("/api/instructor/code")
        if (codeRes.ok) {
          const codeData = await codeRes.json()
          setInstructorCode(codeData.code || "")
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
      ? `${window.location.origin}/join?code=${instructorCode}`
      : `/join?code=${instructorCode}`

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(instructorCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <p className="text-muted-foreground">Connect with new students or find existing ones using your unique code</p>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="email" className="data-[state=active]:bg-card">
            <Mail className="mr-2 h-4 w-4" />
            Send Email Invite
          </TabsTrigger>
          <TabsTrigger value="code" className="data-[state=active]:bg-card">
            <Users className="mr-2 h-4 w-4" />
            Share Instructor Code
          </TabsTrigger>
          <TabsTrigger value="link" className="data-[state=active]:bg-card">
            <Share2 className="mr-2 h-4 w-4" />
            Shareable Link
          </TabsTrigger>
        </TabsList>

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
                  <li>• Student receives email invite</li>
                  <li>• They create their account and verify email</li>
                  <li>• They're automatically linked to your dashboard</li>
                </ul>
              </div>
            </div>

            {/* Recent Invites - Now from database */}
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

        {/* Instructor Code */}
        <TabsContent value="code" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Instructor Code Card */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Your Instructor Code
              </h2>
              <p className="text-sm text-muted-foreground">
                Share this unique code with students. They can use it to find you and request to join your classes
              </p>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Your Code</p>
                <div className="relative">
                  <div className="bg-card border border-border rounded-lg p-4 font-mono text-2xl font-bold text-primary text-center tracking-wider">
                    {instructorCode || "Loading..."}
                  </div>
                  <Button
                    onClick={handleCopyCode}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    disabled={!instructorCode}
                  >
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-warning/5 border border-warning/30 rounded-lg">
                <p className="text-sm text-warning font-medium">How to share:</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Students go to the "Join" page on Driveasy</li>
                  <li>• They enter your unique code</li>
                  <li>• They see your profile and pass rate</li>
                  <li>• They click join and connect to you</li>
                </ul>
              </div>
            </div>

            {/* How it Works */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Students Find You</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Student visits /join page</p>
                    <p className="text-sm text-muted-foreground">On the Driveasy website</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Enters your unique code</p>
                    <p className="text-sm text-muted-foreground">Gets directed to your profile</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Sees your credentials</p>
                    <p className="text-sm text-muted-foreground">Pass rate, car type, experience</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Clicks join</p>
                    <p className="text-sm text-muted-foreground">They're automatically connected to you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Shareable Link */}
        <TabsContent value="link" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Link Sharing */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Shareable Link
              </h2>
              <p className="text-sm text-muted-foreground">
                Share this link on social media, website, or messaging apps. Students can join directly
              </p>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Your Link</p>
                <div className="relative">
                  <Input type="text" value={inviteLink} readOnly className="bg-secondary font-mono text-sm pr-10" />
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    variant="outline"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Share on:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    size="sm"
                    onClick={() =>
                      window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on Driveasy: ${inviteLink}`)}`)
                    }
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `mailto:?subject=Join my driving lessons&body=${encodeURIComponent(`Join me on Driveasy: ${inviteLink}`)}`,
                      )
                    }
                  >
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on Driveasy: ${inviteLink}`)}`,
                      )
                    }
                  >
                    Twitter
                  </Button>
                </div>
              </div>
            </div>

            {/* Link Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">How It Works</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">When someone opens your link, they'll:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    See your instructor profile
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    View your credentials and pass rate
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    Create an account if needed
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    Automatically connect to you
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
