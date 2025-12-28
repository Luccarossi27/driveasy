"use client"

import type React from "react"

import { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"

interface CheckoutFormProps {
  clientSecret: string
  packageName: string
  amount: string
  instructorName: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function CheckoutForm({
  clientSecret,
  packageName,
  amount,
  instructorName,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError("Stripe not loaded")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        onError?.(confirmError.message || "Payment failed")
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess?.()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred"
      setError(message)
      onError?.(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-foreground">Order Summary</h3>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{packageName}</span>
          <span className="font-semibold">£{amount}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Instructor</span>
          <span className="text-foreground">{instructorName}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <label className="block text-sm font-medium text-foreground mb-3">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "hsl(var(--foreground))",
                "::placeholder": {
                  color: "hsl(var(--muted-foreground))",
                },
              },
              invalid: {
                color: "hsl(var(--destructive))",
              },
            },
          }}
          className="p-3 border border-border rounded"
        />
      </div>

      {error && (
        <div className="flex gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={loading || !stripe} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay £${amount}`
        )}
      </Button>
    </form>
  )
}
