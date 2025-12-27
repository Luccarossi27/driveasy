"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Share2, Copy, CheckCircle2, Users, Loader2 } from "lucide-react"

export default function InvitePage() {
  const [studentEmail, setStudentEmail] = useState("")
  const [isSending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const instructorCode = "MIKE-HARRISON-42"
  const inviteLink = `https://drivecoach.app/join?instructor=${instructorCode}`

  const handleSendInvite = async () => {
    if (!studentEmail) return
    setSending(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSending(false)
    setSentSuccess(true)
    setTimeout(() => {
      setSentSuccess(false)
      setStudentEmail("")
    }, 2000)
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

            {/* Recent Invites */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Invitations</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">sophie.chen@email.com</p>
                    <p className="text-xs text-muted-foreground">Sent yesterday</p>
                  </div>
                  <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">Accepted</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">james.wilson@email.com</p>
                    <p className="text-xs text-muted-foreground">Sent 3 days ago</p>
                  </div>
                  <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded">Pending</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">olivia.brown@email.com</p>
                    <p className="text-xs text-muted-foreground">Sent 1 week ago</p>
                  </div>
                  <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">Accepted</span>
                </div>
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
                    {instructorCode}
                  </div>
                  <Button
                    onClick={handleCopyCode}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-warning/5 border border-warning/30 rounded-lg">
                <p className="text-sm text-warning font-medium">How to share:</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Students enter code on the "Find Instructor" page</li>
                  <li>• They see your profile and pass rate</li>
                  <li>• They send you a join request</li>
                  <li>• You accept and they're added to your students</li>
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
                    <p className="font-medium text-foreground">Student visits "Find Instructor"</p>
                    <p className="text-sm text-muted-foreground">On the join page</p>
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
                    <p className="text-sm text-muted-foreground">Pass rate, reviews, experience</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Sends join request</p>
                    <p className="text-sm text-muted-foreground">You approve and they're connected</p>
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
                  <Button variant="outline" className="bg-transparent" size="sm">
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="bg-transparent" size="sm">
                    Email
                  </Button>
                  <Button variant="outline" className="bg-transparent" size="sm">
                    Twitter
                  </Button>
                </div>
              </div>
            </div>

            {/* Link Preview */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Preview</h3>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  MH
                </div>
                <div>
                  <p className="font-semibold text-foreground">Mike Harrison</p>
                  <p className="text-sm text-muted-foreground">Verified Driving Instructor</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-warning">★</span>
                  <span className="font-medium text-foreground">4.9</span>
                  <span className="text-muted-foreground">(24 reviews)</span>
                </div>
                <Button className="w-full mt-2">Join Now</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
