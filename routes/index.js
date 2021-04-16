var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken")
var {url,mongodClient} = require("../config")
var mongodb = require("mongodb")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Board Infinity' });
});

router.post('/shorturl', async function(req, res, next) {
  let client;
  try {
      client = await mongodClient.connect(url)
      let db = client.db("urlshort")
      let token = req.headers.authorization
      let user = jwt.verify(token,"abcdefgh")
      //console.log(user)
      let userID = user.id
      let short = Math.random().toString(20).substr(2,6)
      let shortURL = `http://127.0.0.1:3000/short/${short}`
      let longURL = req.body.url
      await db.collection("urls").insertOne({
        short, shortURL,longURL,count:0
      })
      await db.collection("users").findOneAndUpdate({_id:mongodb.ObjectID(userID)},{$push:{urls:short}})
      res.json({
        message:"Short Url Created",
        shorturl:shortURL
      })

  } catch (error) {
      client.close()
      console.log(error)
  }
});

module.exports = router;
