'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var users = new Schema({
    email : {
        type : String,
        required : true,
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Please enter a valid email address'],
        max : 100
    },
    date_created : {
        type : Date,
        default : Date.now
    },
    date_verified : {
        type : Date
    },
    verification : {
        verification_token : String,
        is_verified : Boolean,
        default : false
    },
    recycle : {
        is_recyclable : Boolean
    },
});

module.exports = mongoose.model('Users', users);