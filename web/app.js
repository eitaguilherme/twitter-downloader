//
var express =         require("express");
var path =            require("path");
var logger =          require("morgan");
var cookieParser =    require("cookie-parser");
var bodyParser =      require("body-parser");
var jwt =             require('jsonwebtoken');
var passport =        require('passport');
var Strategy =        require('passport-twitter').Strategy;
var User =            require('../app/models/user');


let callback_url =  process.env.baseurl.trim();
console.log(callback_url.concat('twitter/return'));
// console.log(callback_url.trim());
passport.use(new Strategy({
    consumerKey: 'QIuvQSjQHLzzpHVU2r3xseNns',
    consumerSecret: 'qdEYaZxPnSxXRjX27q7i7nBvyuskux9vasIFlEqslpQfXH49Uo',
    callbackURL:  callback_url.concat('login/twitter/return')
  },
  function(token, tokenSecret, profile, cb) {
    var _screenName = profile.username;
    var _profilePhoto = profile.photos[0].value;

    var userSession = {
      screenName: _screenName,
      profilePhoto : _profilePhoto,
      token: token,
      tokenSecret: tokenSecret
    }
    return cb(null, userSession);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Web Express App
// ---------------
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
console.log('public > ', path.join(__dirname, "public"));

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Routes
// ------

var indexRoute = require('./routes/index');
app.use('/', indexRoute);

var loginRoute = require('./routes/login');
app.use('/login',loginRoute(passport));

var profileRoute = require('./routes/profile');
app.use('/profile', profileRoute);

// Exports
// -------

module.exports = app;