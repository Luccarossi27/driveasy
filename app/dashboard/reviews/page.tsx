"use client"

import { useState } from "react"
import { students, reviews } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Send, LinkIcon, Copy, BadgeCheck, Clock, Gift, Users, Share2, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReviewsPage() {
  const [copied, setCopied] = useState(false)
  const reviewLink = "https://drivecoach.app/review/mike-harrison"

  // Find students who recently passed and haven't left a review
  const recentlyPassed = students.filter((s) => s.status === "passed")

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Mock referral data
  const referrals = [
    { id: "1", referrer: "Emma Thompson", referee: "Oliver Brown", status: "converted", reward: "£20" },
    { id: "2", referrer: "Amelia Roberts", referee: "Pending", status: "pending", reward: "£20" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews & Referrals</h1>
        <p className="text-muted-foreground">Manage reviews and track student referrals</p>
      </div>

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="reviews" className="data-[state=active]:bg-card">
            <Star className="mr-2 h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="referrals" className="data-[state=active]:bg-card">
            <Gift className="mr-2 h-4 w-4" />
            Referrals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {/* Stats Row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-warning">
                4.9 <Star className="h-6 w-6 fill-warning" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-foreground">{reviews.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Reviews</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-success">{recentlyPassed.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Pending Requests</p>
            </div>
          </div>

          {/* Share Link */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              Shareable Review Link
            </h3>
            <div className="flex gap-2">
              <Input value={reviewLink} readOnly className="bg-secondary font-mono text-sm" />
              <Button variant="outline" onClick={handleCopyLink} className="bg-transparent shrink-0">
                {copied ? <BadgeCheck className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button className="shrink-0">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pending Review Requests */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Pending Requests
                </h3>
                <span className="text-sm text-muted-foreground">{recentlyPassed.length} students</span>
              </div>
              <div className="divide-y divide-border">
                {recentlyPassed.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-sm font-semibold text-success">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Passed on{" "}
                        {student.practicalTestDate &&
                          new Date(student.practicalTestDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                      </p>
                    </div>
                    <Button size="sm">
                      <Send className="mr-2 h-3.5 w-3.5" />
                      Request
                    </Button>
                  </div>
                ))}
                {recentlyPassed.length === 0 && (
                  <div className="px-5 py-8 text-center text-muted-foreground">No pending review requests</div>
                )}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Reviews
                </h3>
              </div>
              <div className="divide-y divide-border">
                {reviews.map((review) => (
                  <div key={review.id} className="px-5 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{review.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating ? "fill-warning text-warning" : "text-muted-foreground",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    {review.isPublic && (
                      <span className="inline-flex items-center gap-1 text-xs text-success mt-2">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Public
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          {/* Referral Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-primary">£40</p>
              <p className="text-sm text-muted-foreground mt-1">Total Rewards Earned</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground mt-1">Successful Referrals</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-warning">1</p>
              <p className="text-sm text-muted-foreground mt-1">Pending Referrals</p>
            </div>
          </div>

          {/* Referral Program Info */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Referral Rewards Program</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When your students refer a friend, both get rewarded! The referrer gets £20 off their next lesson and
                  the new student gets £20 off their first booking.
                </p>
              </div>
            </div>
          </div>

          {/* Referral History */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Referral History</h3>
            </div>
            <div className="divide-y divide-border">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {referral.referrer} → {referral.referee}
                    </p>
                    <p className="text-xs text-muted-foreground">Reward: {referral.reward}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      referral.status === "converted"
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-warning/10 text-warning border border-warning/20",
                    )}
                  >
                    {referral.status === "converted" ? "Converted" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
