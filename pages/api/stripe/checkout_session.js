import { getThemeSlug } from 'lib/theme_utils';
import { getConnection, getNewId, mysqlQuery } from 'lib/utils';
import Stripe from "stripe";
import { getServerSession } from 'next-auth';
import authOptions from "pages/api/auth/[...nextauth].js";
import { getEmailUser } from 'lib/auth_utils';

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

		if (data.size == undefined || data.theme_slug == undefined || data.url_text == undefined || data.with_watermark == undefined) {
			res.status(406).json({error_msg: "Body must contain 'size', 'theme_slug', 'with_watermark', and 'url_text' entries!"});
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

		const user_session = await getServerSession(req, res, authOptions);
		if (!user_session){
			res.status(401).json({error_msg: "You are not authorized!"});
			return;
		}
		
		const con = await getConnection();
		if (con == null){
			res.status(500).json({error_msg: "Could not connect to server!"});
			return;
		}

		const user = user_session ? await getEmailUser(user_session, con) : null;
		if (user == null || user.id == undefined){
			res.status(401).json({error_msg: "You must make an account first!"});
			con.end();
			return;
		}
		if (user != null && user.id == undefined){
			res.status(500).json({error_msg: "Could not find this account"});
			con.end();
			return;
		}

		const theme = getThemeSlug(data.theme_slug);
		if (theme == null || theme.error_msg != undefined){
			res.status(404).json({error_msg: "Could not find this theme!"});
			con.end();
			return;
		}

		const with_watermark = data.with_watermark == true;
		let free = false;

		const price_id = process.env.DEV_ENV ? "price_1NQJgjAjvjIu0fAeKSJwEg8H" : theme.price_ids[data.size];  //price_1NQJgjAjvjIu0fAeKSJwEg8H, price_1NSbuKAjvjIu0fAepKll7FtH

		if (with_watermark && user != null){
			const existing = await mysqlQuery(con, "SELECT order_timestamp FROM orders WHERE owner = ?", [user.id]);
			if (existing.results != null && existing.results.length > 0){
				let highest = 0;
				for (let j = 0; j < existing.results.length; j++){
					if (existing.results[j].order_timestamp > highest) highest = existing.results[j].order_timestamp;
				}

				const time = (new Date()).getTime()/1000;
				if (time - highest <= 60){
					res.status(403).json({error_msg: "You must wait " + Math.trunc(62 - time + highest) + " seconds to do this!"});
					return;
				}
			}
		}

		try {

			var free_count = user == null ? 0 : user.free_images;
			free = free_count > 0 || with_watermark;
			var session = null;

			const [id_res] = await con.execute("SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA='" + process.env.DB_NAME + "' AND TABLE_NAME='orders'");
        	const id = id_res[0]["AUTO_INCREMENT"];
			const pid = getNewId(id);
			
			await con.execute("INSERT INTO orders (owner, pid, order_status, theme_id, order_timestamp, qr_url, size, free) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
				user == null ? null : user.id, pid, free ? 2 : 1, theme.id, Math.trunc((new Date()).getTime()/1000), data.url_text, data.size, with_watermark
			]);

			if (free_count > 0){

				await con.execute("UPDATE accounts SET free_images = ? WHERE id = ?", [free_count > 1 ? free_count-1 : null, user.id]);

			} 
			else if (!with_watermark) {

				const params = {
					line_items: [
						{
							price: price_id,
							quantity: 1,
						},
					],
					payment_method_types: ['card'],
					mode: 'payment',
					success_url: `${req.headers.origin}/${theme.slug}?success=true&awaiting_images=true&order_id=${pid}&session_id={CHECKOUT_SESSION_ID}`,
					cancel_url: `${req.headers.origin}/${theme.slug}`,
				};
				//if (user.email != undefined) params['customer_email'] = user.email;

				session = await stripe.checkout.sessions.create(params);
			}

			if (session != null){
				await con.execute("UPDATE orders SET order_timestamp = ?, stripe_id = ? WHERE id = ?", [
					Math.trunc((new Date()).getTime()/1000), session.id, id
				]);
				con.end();
			}

			res.status(303).json({status: "Success", redirect_url: free ? null : session.url, free, pid});
			//res.redirect(303, session.url);
		} catch (err) {
			console.error(err);
			console.log("Could not create an order!");
			con.end();
			res.status(err.statusCode || 500).json({error_msg: "An error occured while placing this order!", detailed_error: err.message});
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).json({error_msg: "Method not allowed - use POST"})
	}
}