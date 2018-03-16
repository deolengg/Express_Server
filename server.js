var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001;
  
Users = require('./api/model/signUpModel');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/register');
//mongoose.connect('mongodb://35.182.144.38/register');
app.use(bodyParser.urlencoded({extented : true}));
app.use(bodyParser.json());


var routes = require('./api/route/signUpRoute');
routes(app);

app.listen(port);

console.log('Immigration-Server, Rest API Started at ' + port);