'use strict';

module.exports = function (app) {
    var users = require('../controller/signUpController');
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    app.route('/user/register')
    .post(users.addUserEmail);
        //.get(users.listAll)
        

    app.route('/user/verify')
    .get(users.verifyEmail);

    app.route('/user/resend_verification')
    .post(users.resendEmailVerification);

    app.route('/login')
    .get(users.linkedinLogin);

    app.route('/login/facebook')
    .get(users.facebookLogin);
   
};