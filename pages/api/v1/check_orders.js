
import { getServerSession } from "next-auth";
import { getEmailUser } from "lib/auth_utils";
import { getConnection, mysqlQuery } from "lib/utils";
import authOptions from "pages/api/auth/[...nextauth].js";

export default async function handler(req, res){

    if (req.query == undefined || req.query.order_id == undefined){
        res.status(406).json({error_msg: "Missing 'order_id' parameter."});
        return;
    }

    const session = await getServerSession(req, res, authOptions);
    /*if (!session){
        res.status(401).json({error_msg: "You are not authorized!"});
        return;
    }*/

    const con = await getConnection();
    if (con == null){
        res.status(500).json({error_msg: "Could not connect to the server!"});
        return;
    }

    const user = session == null ? null : await getEmailUser(session, con);
    /*if (user == null || user.id == undefined){
        res.status(401).json({error_msg: "You must make an account first!"});
        con.end();
        return;
    }*/

    const res1 = await mysqlQuery(con, "SELECT owner, output FROM orders WHERE id = ?", [req.query.order_id]);
    if (res1.error_msg != null){
        res.status(500).json({error_msg: res1.error_msg});
        con.end();
        return;
    }

    if (res1.results.length == 0){
        res.status(404).json({error_msg: "Order not found"});
        con.end();
        return;
    }
    const order = res1.results[0];
    if (order.owner != null && (user == null || order.owner != user.id)){
        res.status(401).json({error_msg: "You do not own this order!"});
        con.end();
        return;
    }

    con.end();

    res.status(200).json(order);

}