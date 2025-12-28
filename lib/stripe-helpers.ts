import { stripe } from "./stripe"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

interface StripeCustomer {
  id: string
  user_id: string
  stripe_customer_id: string
}

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
    // Check if customer exists in our database
    const existing = await sql("SELECT stripe_customer_id FROM stripe_customers WHERE user_id = $1", [userId])

    if (existing.length > 0) {
      return existing[0].stripe_customer_id
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    })

    // Store in database
    await sql("INSERT INTO stripe_customers (user_id, stripe_customer_id) VALUES ($1, $2)", [userId, customer.id])

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
    await sql(
      `INSERT INTO stripe_transactions 
       (stripe_payment_intent_id, student_id, instructor_id, amount_cents, package_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [paymentIntent.id, studentId, instructorId, amountCents, packageId || null, "pending"],
    )

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
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return null
    }

    // Update transaction status
    const updated = await sql(
      `UPDATE stripe_transactions 
       SET status = 'succeeded', updated_at = NOW() 
       WHERE stripe_payment_intent_id = $1 
       RETURNING *`,
      [paymentIntentId],
    )

    if (updated.length > 0) {
      return updated[0]
    }

    return null
  } catch (error) {
    console.error("[Stripe] Error confirming payment:", error)
    throw error
  }
}

// Get payment history for student
export async function getStudentPaymentHistory(studentId: string): Promise<StripeTransaction[]> {
  try {
    const transactions = await sql(
      `SELECT * FROM stripe_transactions 
       WHERE student_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [studentId],
    )
    return transactions
  } catch (error) {
    console.error("[Stripe] Error fetching student payments:", error)
    throw error
  }
}

// Get payment history for instructor
export async function getInstructorPaymentHistory(instructorId: string): Promise<StripeTransaction[]> {
  try {
    const transactions = await sql(
      `SELECT * FROM stripe_transactions 
       WHERE instructor_id = $1 AND status = 'succeeded'
       ORDER BY created_at DESC 
       LIMIT 50`,
      [instructorId],
    )
    return transactions
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
    const result = await sql(
      `SELECT 
        SUM(amount_cents) as total_amount,
        SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN amount_cents ELSE 0 END) as monthly_amount,
        COUNT(*) as transaction_count
       FROM stripe_transactions 
       WHERE instructor_id = $1 AND status = 'succeeded'`,
      [instructorId],
    )

    const row = result[0]
    return {
      totalEarnings: (row.total_amount || 0) / 100,
      monthlyEarnings: (row.monthly_amount || 0) / 100,
      transactionCount: row.transaction_count || 0,
    }
  } catch (error) {
    console.error("[Stripe] Error calculating earnings:", error)
    throw error
  }
}

// Refund payment
export async function refundPayment(paymentIntentId: string, reason?: string): Promise<boolean> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: (reason as any) || "requested_by_customer",
    })

    // Update transaction status
    await sql(
      `UPDATE stripe_transactions 
       SET status = 'refunded', updated_at = NOW() 
       WHERE stripe_payment_intent_id = $1`,
      [paymentIntentId],
    )

    return refund.status === "succeeded"
  } catch (error) {
    console.error("[Stripe] Error refunding payment:", error)
    throw error
  }
}
