var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken")
var {url,mongodClient} = require("../config")
var mongodb = require("mongodb")

router.get('/:shorturl', async function(req, res, next) {
  let client;
  try {
      client = await mongodClient.connect(url)
      let db = client.db("urlshort")
      let short = req.params.shorturl
      let data = await db.collection("urls").findOne({short})
      let longurl = data.longURL
      await db.collection("urls").findOneAndUpdate({short},{$inc:{count:1}})
      res.redirect(longurl)

  } catch (error) {
      client.close()
      console.log(error)
  }
});

module.exports = router;
