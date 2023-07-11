

export default async function handler(req, res) {
    /*if (req.method != "POST"){
        res.status(400).json({error_msg: "Must be POST request"});
        return;
    }*/

    if (req.query == undefined){
        res.status(400).json({error_msg: "Missing body", method_type: req.method});
        return;
    }
    const body = req.query;
    if (body.pw == undefined){
        res.status(400).json({error_msg: "Must have password", method_type: req.method, query: body});
        return;
    }

    if (body.pw != "jTnekDBnwiqp$ejfd5@a") {
        res.status(401).json({error_msg: "Incorrect", query: body});
        return;
    }

    res.status(200).json({env: process.env, secrets: process.env.secrets, secrets_defined: process.env.secrets != undefined, method_type: req.method});
}