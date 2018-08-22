var express = require("express");

var app = express();

var api = require('../api/app');
var web = require('../web/app');

app.use('/api', api);
app.use('/', web);



module.exports = app;