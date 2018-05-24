'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validPhone(phone){
    var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    return re.test(String(phone)); //just canada for 
}

var questions = new Schema({
    id : { type : String, required : true},
    name : String,
    type : String,
    format : String,
    multiple : { type : Boolean, default : false},
    options : [],
    filter : []
});
module.exports = mongoose.model('Questions', questions);