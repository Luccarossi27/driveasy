"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, type Stripe } from "@stripe/stripe-js/pure"
import { CheckoutForm } from "@/components/stripe/checkout-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { DEFAULT_PACKAGES, formatPrice } from "@/lib/lesson-packages"

// Use a singleton pattern to avoid recreating the Stripe promise
let stripePromise: Promise<Stripe | null> | null = null
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
  }
  return stripePromise
}

export function CheckoutPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package")
  const instructorId = searchParams.get("instructor")

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [instructorName, setInstructorName] = useState("")
  const [stripe, setStripe] = useState<Stripe | null>(null)

  const selectedPackage = packageId ? DEFAULT_PACKAGES.find((p) => p.id === packageId) : null

  // Initialize Stripe on mount
  useEffect(() => {
    getStripe().then(setStripe)
  }, [])

  useEffect(() => {
    const initializePayment = async () => {
      try {
        console.log("[v0] Initializing payment with:", { packageId, instructorId, selectedPackage })

        if (!selectedPackage || !instructorId || !packageId) {
          setError("Missing payment details. Please go back and try again.")
          setLoading(false)
          return
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

        console.log("[v0] Payment API response status:", res.status)
        const data = await res.json()
        console.log("[v0] Payment API response:", data)

        if (!res.ok) {
          throw new Error(data.error || "Failed to initialize payment")
        }

        setClientSecret(data.clientSecret)
        setInstructorName(data.instructorName)
      } catch (err) {
        console.error("[v0] Payment init error:", err)
        const message = err instanceof Error ? err.message : "Error initializing payment"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    initializePayment()
  }, [packageId, instructorId, selectedPackage])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Initializing payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (!clientSecret || !stripe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Unable to initialize payment</p>
          <Button onClick={() => router.back()}>Go Back</Button>
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

          <Elements stripe={stripe} options={{ clientSecret }}>
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
