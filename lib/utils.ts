import mysql from "mysql2/promise";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export function getNewId(id: number){ //100 -> 9999999999
    const len = ("" + id).length;
    return "" + len + Math.floor(Math.random() * (Math.pow(10, 9-len))) + id;
}

export function getId(pid: string){
    if (!pid.match(/^\d+$/) || pid.length == 0 || pid == "0") return -1;
    const fn = parseInt(pid.charAt(0));
    if (fn > pid.length-1) return -1;
    return parseInt(pid.substring(pid.length - fn, pid.length));
}

export async function getConnection(){

    return new Promise(async (resolve, reject) => {
        setTimeout(reject, 4000);
        const params = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: 3306,
            password: process.env.DB_PW,
            database: process.env.DB_NAME,
        }
        var con = null;

        try{
            if (!process.env.DEV_ENV){
                //@ts-ignore
                params.ssl = {
                    //@ts-ignore
                    ca: Buffer.from(process.env.DB_CA.replaceAll("\\n", "\n"), "utf-8"), //newline chars must be in env var
                    //rejectUnauthorized: false
                }
            }
            //@ts-ignore
            con = await mysql.createConnection(params);
        } catch (err){
            console.log("Could not connect to MySQL:");
            console.error(err);
        }
        resolve(con);
    });
}

export async function mysqlQuery(con: object, sql: string, values: string[]){
    //if (server_auth !=  process.env.SERVER_AUTH) throw "Incorrect server mysql authentication";

    if (con == undefined || typeof con == "string") return {error_msg: "Invalid connection type!", results: []}
    
    return new Promise(async (resolve) => {
        try{
            /*const con = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PW,
                database: process.env.DB_NAME
            })*/
            
            //@ts-ignore
            const [results] = await con.execute(sql, values, (err, res, fields) => {
                if (err){
                    console.log(err);
                    console.log("Could not make a MySQL query.");
                    //@ts-ignore
                    con.end();
                    resolve({error_msg: "Could not connect to the server!", results: []});
                    return [];
                }
            })
            //con.end();

            resolve({error_msg: null, results});

        } catch (error){
            console.log(error);
            resolve({error_msg: "Could not connect to the server!", results: []});
            //throw "Could not connect to database";
        }
    });

}

export function shuffleArray(array: (string | number)[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

export function encryptConstiv(s: string){
    //@ts-ignore
    const iv = Buffer.from(process.env.CONST_IV, "hex");
    return encrypt(s, iv);
}

export function encrypt(s: string, iv: Buffer): string {
    if (typeof s != "string") return "null";
    //@ts-ignore
    const key = Buffer.from(process.env.ENCRYPT_KEY1, "hex");
    if (iv == null) iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    return iv.toString("base64") + cipher.update(s, "utf-8", "base64") + cipher.final("base64");
}

export function decrypt(s: string){
    //@ts-ignore
    const key = Buffer.from(process.env.ENCRYPT_KEY1, "hex");
    const decipher = createDecipheriv("aes-256-cbc", key, Buffer.from(s.substring(0, 24), "base64"));
    return decipher.update(s.substring(24, s.length), "base64", "utf-8") + decipher.final();
}