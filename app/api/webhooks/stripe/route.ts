import { stripe } from "@/lib/stripe"
import { confirmPayment } from "@/lib/stripe-helpers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        const transaction = await confirmPayment(paymentIntent.id)

        if (transaction) {
          // Create lesson booking
          await sql(
            `INSERT INTO lessons (instructor_id, student_id, status) 
             VALUES ($1, $2, 'scheduled')`,
            [transaction.instructor_id, transaction.student_id],
          )

          // Update student balance (reduce by payment amount)
          const amountInPounds = transaction.amount_cents / 100
          await sql(`UPDATE students SET balance = balance - $1 WHERE id = $2`, [
            amountInPounds,
            transaction.student_id,
          ])
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        await sql(`UPDATE stripe_transactions SET status = 'failed' WHERE stripe_payment_intent_id = $1`, [
          paymentIntent.id,
        ])
        break
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("[Webhook] Stripe webhook error:", error)
    return Response.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}
