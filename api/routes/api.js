var express = require('express');
var router = express.Router();

var config = require('../../config');

var jwt = require('jsonwebtoken');

router.use(function(req,res,next){
    // check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	if (token) {
		console.log('tem token');
		// verifies secret and checks exp
		jwt.verify(token, config.jwtsecret, function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
}
});

module.exports = router;