'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var user_data = new Schema({
    question_id : String,
    value : String,
    user_id : String,
    service_type : String,
});

module.exports = mongoose.model('UserData', user_data);