var express = require('express'),
    app = express(),
    fs = require('fs'),
    port = process.env.PORT || 3001;
  
Users = require('./api/model/signUpModel');
Services = require('./api/model/servicesListModel');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/immigration-service');
//mongoose.connect('mongodb://35.182.144.38/register');
app.use(bodyParser.urlencoded({extented : true}));
app.use(bodyParser.json());


var serviceRoute = require('./api/route/servicesRoute');
var routes = require('./api/route/signUpRoute');

fs.readdirSync('./api/route/').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        routes = require('./api/route/' + file);
        routes(app);
    }
});

app.listen(port);

console.log('Immigration-Server, Rest API Started at ' + port);