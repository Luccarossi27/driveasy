"use client"

import { Suspense } from "react"
import { CheckoutPageClient } from "@/components/stripe/checkout-page-client"
import { Loader2 } from "lucide-react"

function CheckoutLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPageClient />
    </Suspense>
  )
}
