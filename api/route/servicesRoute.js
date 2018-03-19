'use strict';

module.exports = function (app) {
    var services = require('../controller/servicesController');
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    app.route('/api/services')
    .post(services.addService)
    .get(services.listServices);
   
};