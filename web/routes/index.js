var express = require('express');
var router = express.Router();

var config = require("../../config");
var jwt = require('jsonwebtoken');

/* GET home page. */
router.use(function timeLog (req, res, next) {
  next()
});

router.get('/', function(req,res){
   var token = null; 
  if(req.user){
    const payload = {
      screenName: req.user.screenName,
      token: req.user.token,
      tokenSecret: req.user.tokenSecret,
    };
    token = jwt.sign(payload, config.jwtsecret, {
        expiresIn: 1440
    });
  }
  res.render('home', { user: req.user, token: token, baseurl: process.env.baseurl.trim().concat('api/tweet') });
});

module.exports = router;