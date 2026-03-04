import { stripe } from "./stripe"
import { createClient } from "@/lib/supabase/server"

interface StripeTransaction {
  id: string
  stripe_payment_intent_id: string
  student_id: string
  instructor_id: string
  amount_cents: number
  status: string
}

// Get or create Stripe customer for a user
export async function getOrCreateStripeCustomer(userId: string, email: string, name: string): Promise<string> {
  try {
    const supabase = await createClient()

    // Check if customer exists in our database
    const { data: existing } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single()

    if (existing) {
      return existing.stripe_customer_id
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    })

    // Store in database
    await supabase
      .from("stripe_customers")
      .insert({ user_id: userId, stripe_customer_id: customer.id })

    return customer.id
  } catch (error) {
    console.error("[Stripe] Error getting/creating customer:", error)
    throw error
  }
}

// Create payment intent
export async function createPaymentIntent(
  customerId: string,
  amountCents: number,
  description: string,
  studentId: string,
  instructorId: string,
  packageId?: string,
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const supabase = await createClient()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "gbp",
      customer: customerId,
      description,
      metadata: {
        studentId,
        instructorId,
        packageId: packageId || "",
      },
    })

    // Store transaction record
    await supabase.from("stripe_transactions").insert({
      stripe_payment_intent_id: paymentIntent.id,
      student_id: studentId,
      instructor_id: instructorId,
      amount_cents: amountCents,
      package_id: packageId || null,
      status: "pending",
    })

    return {
      clientSecret: paymentIntent.client_secret || "",
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error("[Stripe] Error creating payment intent:", error)
    throw error
  }
}

// Confirm payment (called after Stripe payment succeeds)
export async function confirmPayment(paymentIntentId: string): Promise<StripeTransaction | null> {
  try {
    const supabase = await createClient()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return null
    }

    // Update transaction status
    const { data: updated } = await supabase
      .from("stripe_transactions")
      .update({ status: "succeeded", updated_at: new Date().toISOString() })
      .eq("stripe_payment_intent_id", paymentIntentId)
      .select()
      .single()

    return updated || null
  } catch (error) {
    console.error("[Stripe] Error confirming payment:", error)
    throw error
  }
}

// Get payment history for student
export async function getStudentPaymentHistory(studentId: string): Promise<StripeTransaction[]> {
  try {
    const supabase = await createClient()

    const { data: transactions } = await supabase
      .from("stripe_transactions")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(50)

    return transactions || []
  } catch (error) {
    console.error("[Stripe] Error fetching student payments:", error)
    throw error
  }
}

// Get payment history for instructor
export async function getInstructorPaymentHistory(instructorId: string): Promise<StripeTransaction[]> {
  try {
    const supabase = await createClient()

    const { data: transactions } = await supabase
      .from("stripe_transactions")
      .select("*")
      .eq("instructor_id", instructorId)
      .eq("status", "succeeded")
      .order("created_at", { ascending: false })
      .limit(50)

    return transactions || []
  } catch (error) {
    console.error("[Stripe] Error fetching instructor payments:", error)
    throw error
  }
}

// Calculate instructor earnings
export async function getInstructorEarnings(instructorId: string): Promise<{
  totalEarnings: number
  monthlyEarnings: number
  transactionCount: number
}> {
  try {
    const supabase = await createClient()

    const { data: transactions } = await supabase
      .from("stripe_transactions")
      .select("amount_cents, created_at")
      .eq("instructor_id", instructorId)
      .eq("status", "succeeded")

    if (!transactions || transactions.length === 0) {
      return { totalEarnings: 0, monthlyEarnings: 0, transactionCount: 0 }
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount_cents || 0), 0)
    const monthlyAmount = transactions
      .filter((t) => new Date(t.created_at) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + (t.amount_cents || 0), 0)

    return {
      totalEarnings: totalAmount / 100,
      monthlyEarnings: monthlyAmount / 100,
      transactionCount: transactions.length,
    }
  } catch (error) {
    console.error("[Stripe] Error calculating earnings:", error)
    throw error
  }
}

// Refund payment
export async function refundPayment(paymentIntentId: string, reason?: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: (reason as "requested_by_customer" | "duplicate" | "fraudulent") || "requested_by_customer",
    })

    // Update transaction status
    await supabase
      .from("stripe_transactions")
      .update({ status: "refunded", updated_at: new Date().toISOString() })
      .eq("stripe_payment_intent_id", paymentIntentId)

    return refund.status === "succeeded"
  } catch (error) {
    console.error("[Stripe] Error refunding payment:", error)
    throw error
  }
}
