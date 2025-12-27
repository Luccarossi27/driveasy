"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface DocumentReviewActionsProps {
  documentId?: string
  instructorId: string
  isFinalApproval?: boolean
  currentStatus?: string
}

export function DocumentReviewActions({
  documentId,
  instructorId,
  isFinalApproval = false,
  currentStatus,
}: DocumentReviewActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  async function handleAction(action: "approve" | "reject") {
    setLoading(true)

    try {
      const endpoint = isFinalApproval ? "/api/admin/instructor/verify" : "/api/admin/document/review"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          instructorId,
          action,
          rejectionReason: action === "reject" ? rejectionReason : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Action failed")
      }

      router.refresh()
      setShowRejectForm(false)
      setRejectionReason("")
    } catch (error) {
      console.error("Review action error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (isFinalApproval) {
    if (currentStatus === "approved") {
      return (
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Instructor Approved</span>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Final Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showRejectForm ? (
            <div className="space-y-3">
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowRejectForm(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction("reject")}
                  disabled={loading || !rejectionReason}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Confirm Rejection
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleAction("approve")}
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Instructor
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setShowRejectForm(true)}
                disabled={loading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Document-level actions
  return (
    <div className="flex gap-2 mt-3">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
        onClick={() => handleAction("approve")}
        disabled={loading}
      >
        {loading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
        <CheckCircle className="h-3 w-3 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
        onClick={() => setShowRejectForm(true)}
        disabled={loading}
      >
        <XCircle className="h-3 w-3 mr-1" />
        Reject
      </Button>
    </div>
  )
}
