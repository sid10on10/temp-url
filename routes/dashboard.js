var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken")
var {url,mongodClient} = require("../config")
var mongodb = require("mongodb");
const { authenticate } = require('../common/auth');

router.get('/data', authenticate,async function(req, res, next) {
  let client;
  try {
      client = await mongodClient.connect(url)
      let db = client.db("urlshort")
      let token = req.headers.authorization
      let user = jwt.verify(token,"abcdefgh")
      let userID = user.id
      let userData = await db.collection("users").findOne({_id:mongodb.ObjectID(userID)})      
      if(userData){
        // do something
        let urls = userData.urls
        let outarr = []
        if(urls!=undefined){
            for(each of urls){
                if(each){
                    let eachURL = await db.collection("urls").findOne({short:each})
                    let longURL = eachURL.longURL
                    let shortURL = eachURL.shortURL
                    let count = eachURL.count
                    outarr.push({longURL,shortURL,count})
                }else{
                    // pass
                }
            }
            res.json({message:"Success",data:outarr})
        }else{
            res.json({message:"Success",data:outarr})
        }
      }
  } catch (error) {
      client.close()
      console.log(error)
  }
});

module.exports = router;
