var express = require('express');
var router = express.Router();
var {url,mongodClient} = require("../config")
const bcryptjs = require("bcryptjs")


/* Register Endpoint
   We will not store the actual password of user in database
*/
router.post('/', async function(req, res, next) {
    let client;
    try {
        client = await mongodClient.connect(url)
        let db = client.db("urlshort")
        let {email,password} = req.body
        let user = await db.collection("users").findOne({email})
        if(user){
            // stop register
            res.json({
                message:"User already registered kindly login"
            })
        }else{
            // let him register
            let salt  = await bcryptjs.genSalt(10);
            let hash = await bcryptjs.hash(password,salt)
            password = hash
            await db.collection("users").insertOne({
                email,password
            })
            res.json({
                message:"Registration Successfull You can now login"
            })
        }
        
    } catch (error) {
        client.close()
        console.log(error)
    }
});

module.exports = router;