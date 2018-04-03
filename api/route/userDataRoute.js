'use strict';

module.exports = function (app) {
    var user_data = require('../controller/userDataController');
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
      
    app.route('/questionnaire/user/data')
    .post(user_data.saveUserDataPerQuestion); 
    
}