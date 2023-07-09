import Stripe from 'stripe';
import { buffer } from 'micro';
import { getConnection } from '../../../lib/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
export default async function handleWebhookEvent(req, res) {
  console.log("ALSKJFFK webhook")
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;

  try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_KEY);
  } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Payment successful for session ID: ${session.id}`);

      const con = await getConnection();
      if (con == null){
        console.error("ERROR: Could not connect to DB after receiving successful payment! Stripe Session = " + session.id);
        return;
      }

      await con.execute("UPDATE orders SET order_status = 2 WHERE stripe_id = ?", [session.id]);

      console.log("Success!");

      // Handle post-payment actions here
      break;
      
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }
  res.status(200).end();
}