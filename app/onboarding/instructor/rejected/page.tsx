import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Mail, Phone, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function RejectedApplicationPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>Application Not Approved</CardTitle>
          <CardDescription>Unfortunately, your instructor application was not approved at this time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium">What can you do?</h3>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-4 w-4 text-primary mt-0.5" />
                <span>Review the rejection reason in your email and resubmit updated documents</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>Contact our support team if you believe this was an error</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Need help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Our support team can help clarify why your application was not approved and guide you through
              resubmission.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>support@drivecoach.com</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/onboarding/instructor">
                <RefreshCw className="h-4 w-4 mr-2" />
                Resubmit Application
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
