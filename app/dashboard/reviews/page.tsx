"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  Send,
  LinkIcon,
  Copy,
  BadgeCheck,
  Clock,
  Gift,
  Users,
  Share2,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  studentId: string
  studentName: string
  rating: number
  comment: string
  date: string
  isPublic: boolean
}

interface Student {
  id: string
  name: string
  status: string
  practicalTestDate?: string
}

interface Referral {
  id: string
  referrer: string
  referee: string
  status: string
  reward: string
}

export default function ReviewsPage() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [recentlyPassed, setRecentlyPassed] = useState<Student[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [reviewLink, setReviewLink] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [reviewsRes, studentsRes, referralsRes] = await Promise.all([
          fetch("/api/instructor/reviews"),
          fetch("/api/instructor/students?status=passed"),
          fetch("/api/instructor/referrals"),
        ])

        if (reviewsRes.ok) {
          const data = await reviewsRes.json()
          setReviews(data.reviews || [])
          setReviewLink(data.reviewLink || `${window.location.origin}/review`)
        }

        if (studentsRes.ok) {
          const data = await studentsRes.json()
          setRecentlyPassed(data.students || [])
        }

        if (referralsRes.ok) {
          const data = await referralsRes.json()
          setReferrals(data.referrals || [])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Calculate stats
  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"
  const totalRewards = referrals.filter((r) => r.status === "converted").length * 20
  const successfulReferrals = referrals.filter((r) => r.status === "converted").length
  const pendingReferrals = referrals.filter((r) => r.status === "pending").length

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
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-amber-500">
                {avgRating} <Star className="h-6 w-6 fill-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-foreground">{reviews.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Reviews</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-green-500">{recentlyPassed.length}</p>
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
              <Input value={reviewLink || "Loading..."} readOnly className="bg-secondary font-mono text-sm" />
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="bg-transparent shrink-0"
                disabled={!reviewLink}
              >
                {copied ? <BadgeCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button className="shrink-0" disabled={!reviewLink}>
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
                  <Clock className="h-5 w-5 text-amber-500" />
                  Pending Requests
                </h3>
                <span className="text-sm text-muted-foreground">{recentlyPassed.length} students</span>
              </div>
              <div className="divide-y divide-border">
                {recentlyPassed.length === 0 ? (
                  <div className="px-5 py-8 text-center text-muted-foreground">No pending review requests</div>
                ) : (
                  recentlyPassed.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-sm font-semibold text-green-500">
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
                  ))
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
                {reviews.length === 0 ? (
                  <div className="px-5 py-8 text-center text-muted-foreground">No reviews yet</div>
                ) : (
                  reviews.map((review) => (
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
                                i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      {review.isPublic && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-500 mt-2">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Public
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          {/* Referral Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-primary">£{totalRewards}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Rewards Earned</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-foreground">{successfulReferrals}</p>
              <p className="text-sm text-muted-foreground mt-1">Successful Referrals</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-3xl font-bold text-amber-500">{pendingReferrals}</p>
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
              {referrals.length === 0 ? (
                <div className="px-5 py-8 text-center text-muted-foreground">No referrals yet</div>
              ) : (
                referrals.map((referral) => (
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
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                      )}
                    >
                      {referral.status === "converted" ? "Converted" : "Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
