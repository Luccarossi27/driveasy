import { stripe } from "@/lib/stripe"
import { confirmPayment } from "@/lib/stripe-helpers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
    const supabase = await createClient()

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        const transaction = await confirmPayment(paymentIntent.id)

        if (transaction) {
          // Create lesson booking
          await supabase.from("lessons").insert({
            instructor_id: transaction.instructor_id,
            student_id: transaction.student_id,
            status: "scheduled",
          })

          // Update student balance (reduce by payment amount)
          const amountInPounds = transaction.amount_cents / 100
          const { data: student } = await supabase
            .from("students")
            .select("balance")
            .eq("id", transaction.student_id)
            .single()

          if (student) {
            await supabase
              .from("students")
              .update({ balance: (student.balance || 0) - amountInPounds })
              .eq("id", transaction.student_id)
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        await supabase
          .from("stripe_transactions")
          .update({ status: "failed" })
          .eq("stripe_payment_intent_id", paymentIntent.id)
        break
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("[Webhook] Stripe webhook error:", error)
    return Response.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}
