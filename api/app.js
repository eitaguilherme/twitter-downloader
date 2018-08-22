var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

// var routes = require("./routes");
var apiRoute = require('./routes/api');
var tweetRoute = require('./routes/tweet');

// API Express App
// ---------------

var app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
// ------

app.use("/", apiRoute);
app.use("/tweet", tweetRoute);

// Exports
// -------

module.exports = app;