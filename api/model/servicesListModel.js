'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var services = new Schema({
    name : {
        type : String,
        required : true,
        max : 100
    },
    description : {
        type : String,
        max : 100
    },
    available : {
        type : Boolean,
        default : false
    },
    questions: [String]
});

module.exports = mongoose.model('Services', services);