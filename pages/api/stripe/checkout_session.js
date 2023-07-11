import { getThemeSlug } from 'lib/theme_utils';
import { getConnection } from 'lib/utils';
import Stripe from "stripe";

//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	if (req.method === 'POST') {

		if (req.body == undefined || req.body == ""){
            res.status(406).json({error_msg: "Missing request data"});
            return;
        }
        var data = null;
        try {
            data = JSON.parse(req.body);
        } catch (ex){
            res.status(406).json({error_msg: "Invalid JSON format for order request data"});
            return;
        }

		if (data.size == undefined || data.theme_slug == undefined || data.url_text == undefined || data.user == undefined) {
			res.status(406).json({error_msg: "Body must contain 'size', 'theme_slug', 'user', and 'url_text' entries!"});
			return;
		}
		if (typeof data.size != "number" || data.size < 0 || data.size > 2){
			res.status(406).json({error_msg: "Size must be an integer between 0-2!"});
			return;
		}
		if (typeof data.url_text != "string" || data.url_text.length >= 50 || data.url_text.length == 0){
			res.status(406).json({error_msg: "Invalid URL Text! Must be less than 50 characters in length."});
			return;
		}
		
		const con = await getConnection();
		if (con == null){
			res.status(500).json({error_msg: "Could not connect to server!"});
			return;
		}

		const theme = getThemeSlug(data.theme_slug);
		if (theme == null || theme.error_msg != undefined){
			res.status(404).json({error_msg: "Could not find this theme!"});
			con.end();
			return;
		}

		const price_id = process.env.DEV_ENV ? "price_1NSbuKAjvjIu0fAepKll7FtH" : theme.price_ids[data.size];  //price_1NQJgjAjvjIu0fAeKSJwEg8H

		try {

			const params = {
				line_items: [
					{
						price: price_id,
						quantity: 1,
					},
				],
				payment_method_types: ['card'],
				mode: 'payment',
				success_url: `${req.headers.origin}/${theme.slug}?success=true&awaiting_image=true&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}/${theme.slug}?canceled=true`,
			};
			if (data.user.email != undefined) params['customer_email'] = data.user.email;

			const session = await stripe.checkout.sessions.create(params);

			await con.execute("INSERT INTO orders (owner, order_status, theme_id, order_timestamp, qr_url, stripe_id, size) VALUES (?, ?, ?, ?, ?, ?, ?)", [
				data.user.id, 1, theme.id, Math.trunc((new Date()).getTime()/1000), data.url_text, session.id, data.size
			]);
			con.end();

			res.status(303).json({status: "Success", redirect_url: session.url});
			//res.redirect(303, session.url);
		} catch (err) {
			console.error(err);
			console.log("Could not create an order!");
			res.status(err.statusCode || 500).json({error_msg: "An error occured while placing this order!"});
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).json({error_msg: "Method not allowed - use POST"})
	}
}