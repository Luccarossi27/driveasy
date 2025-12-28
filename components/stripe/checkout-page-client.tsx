"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CheckoutForm } from "@/components/stripe/checkout-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { DEFAULT_PACKAGES, formatPrice } from "@/lib/lesson-packages"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export function CheckoutPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package")
  const instructorId = searchParams.get("instructor")

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [instructorName, setInstructorName] = useState("")

  const selectedPackage = packageId ? DEFAULT_PACKAGES.find((p) => p.id === packageId) : null

  const initializePayment = async () => {
    try {
      setLoading(true)

      if (!selectedPackage || !instructorId || !packageId) {
        throw new Error("Missing payment details")
      }

      const res = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          instructorId,
          amountCents: selectedPackage.priceInPence,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment")
      }

      setClientSecret(data.clientSecret)
      setInstructorName(data.instructorName)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error initializing payment"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    router.push("/portal/book?success=true")
  }

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg)
  }

  if (!selectedPackage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Invalid package selected</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Initializing payment...</p>
            </>
          ) : (
            <>
              {error ? (
                <>
                  <p className="text-destructive">{error}</p>
                  <Button onClick={() => router.back()}>Go Back</Button>
                </>
              ) : (
                <Button onClick={initializePayment}>Start Payment</Button>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-md mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Complete Payment</h1>
            <p className="text-muted-foreground">Secure checkout powered by Stripe</p>
          </div>

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              packageName={selectedPackage.name}
              amount={formatPrice(selectedPackage.priceInPence)}
              instructorName={instructorName}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}
