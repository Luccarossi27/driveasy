import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Application Under Review</CardTitle>
          <CardDescription>
            Thank you for submitting your documents. Our team is reviewing your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium">What happens next?</h3>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Documents submitted successfully</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <span>Our team will review your documents within 24-48 hours</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>You will receive an email once your account is approved</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Need help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you have any questions about your application, please contact our support team.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>support@drivecoach.com</span>
            </div>
          </div>

          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
