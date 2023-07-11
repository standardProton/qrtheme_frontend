

import { encrypt, getNewId } from "./utils";

export const auth_iv = Buffer.from(process.env.AUTH_IV, "hex")

//institution role:
//0=none (student), 1=reserved, 2 = teacher/instructor, 3 = administrator

export async function getEmailUser(session, con){
    if (session == null || session.user == undefined || session.user.email == undefined) return null;
    const email = session.user.email;
    const name = session.user.name;
    const user = {
        id: -1,
        name,
        email,
        orders: [],
        free_images: 0
    }

    if (con == null) {
        console.log("Error: Could not get MySQL connection in validating an email.");
        return user;
    }

    const [r1] = await con.execute("SELECT * FROM accounts WHERE email=?", [encrypt(email, auth_iv)], (err, results, fields) => {
        if (err) {
            console.log("Could not validate an email:");
            console.log(err);
            con.end();
            return user;
        }
    })

    if (r1.length == 0) { //new user
        const [id_res] = await con.execute("SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA='" + process.env.DB_NAME + "' AND TABLE_NAME='accounts'");
        const new_id = id_res[0]["AUTO_INCREMENT"];

        user.id = new_id;

        con.execute("INSERT INTO accounts (fid, name, email, free_images) VALUES (?, ?, ?, ?)",
            [getNewId(new_id), encrypt(name), encrypt(email, auth_iv), 3],
            (err) => {
                if (err){
                    console.log(err);
                    console.log("Could not create a new user!");
                }
            }
        );

    } else {
        const res = r1[0];
        if (res.banned) {
            user.name = "Account Banned!";
            user.banned = true;
            return user;
        }

        user.id = res.id;
        user.orders = res.orders == null ? {} : JSON.parse(decrypt(res.orders));
        user.free_images = res.free_images == null ? 0 : res.free_images;
    }
    return user;

}