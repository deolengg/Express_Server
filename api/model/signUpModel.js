'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
    first_name : {
        type : String,
        lowercase: true,
        max : 100
    },
    last_name : {
        type : String,
        lowercase: true,
        max : 100
    }
});

module.exports = mongoose.model('Users', users);