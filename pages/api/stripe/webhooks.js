import Stripe from 'stripe';
import { buffer } from 'micro';
import { getConnection, mysqlQuery } from 'lib/utils';

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

      const session_id = session.id;
      console.log("Searching for order with encrypted stripe id " + session_id);

      await con.execute("UPDATE orders SET order_status = 2 WHERE stripe_id = ?", [session_id]);

      const res1 = await mysqlQuery("SELECT * FROM orders WHERE stripe_id = ?", [session_id]);

      if (res1.error_msg == null){

        if (res1.results.length > 0) {

          const theme_id = res1.results[0].id;
          const user_id = res1.results[0].owner;

          con.execute("UPDATE themes SET purchases = purchases + 1, purchasers = CONCAT(purchasers, ?) WHERE id = ?", [theme_id, user_id + " "]);

          console.log("Updating stats for theme id " + theme_id + ", owner=" + user_id);

        }

      } else {
        console.log("Error while updating theme stats:");
        console.error(res1.error_msg);
      }

      console.log("Success!");

      // Handle post-payment actions here
      break;
      
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }
  res.status(200).end();
}