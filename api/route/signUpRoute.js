'use strict';

module.exports = function (app) {
    var users = require('../controller/signUpController');

    app.route('/user/register')
        .get(users.listAll)
        .post(users.addUserEmail);

    app.route('/user/verify')
    .get(users.verifyEmail);
   
};