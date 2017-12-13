// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var https = require('https');
var http = require('http');
var app      = express();
const fs = require('fs');
var port     = 9000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var configVar = require('./config/configVars.js');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static('public'));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: configVar.secretCode })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// redirect if not secure ===============
app.all('*',function(req, res, next){
        if(req.secure){
            return next();
        };
        res.redirect('https://'+req.host+req.url);
    });
// routes ======================================================================

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
const options = {
  key: fs.readFileSync(configVar.keyPath),
  cert: fs.readFileSync(configVar.certPath)
};
http.createServer(app).listen(8000);
https.createServer(options, app).listen(9000);
console.log('The magic happens on port ' + port);