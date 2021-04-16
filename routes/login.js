var express = require('express');
var router = express.Router();
var {url,mongodClient} = require("../config")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")


// what is a middleware

// req  -----> server  -----> based on endpoint it will pass it to a router

// middleware -> req ---> middleware (modify it)  ---> give it back to router

router.post('/', async function(req, res, next) {
    let client;
    try {
        client = await mongodClient.connect(url)
        let db = client.db("urlshort")
        let {email,password} = req.body
        let user = await db.collection("users").findOne({email})
        if(user){
            // do something
            let result = await bcryptjs.compare(password,user.password)
            if(result){
                let token = jwt.sign({id:user._id},"abcdefgh")
                res.json({
                    message:"Login Is Successfull Token is generated",
                    token
                })
            }else{
                res.json({
                    message:"Password Invalid"
                })
            }
        }else{
            // no user found
            res.json({
                message:"No User Found with this email."
            })
        }
        
    } catch (error) {
        client.close()
        console.log(error)
    }
});

module.exports = router;