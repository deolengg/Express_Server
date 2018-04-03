'use strict';

var mongoose = require('mongoose');
var Question = require('../model/questionModel');
var Service = require('../model/servicesListModel');
var User = require('../model/signUpModel');

var UserData = require('../model/userDataModel');


async function saveUserDataPerQuestion(req, res) {
    var serviceName = req.body.service_type;
    var questionId = req.body.question_id;
    var userId = req.body.user_id;

    let isValid = await validateService(serviceName);
    if (!isValid) {
        return res.status(400).send({ Error: 'Invalid Service' });
    }

    isValid = await validateQuestion(questionId);
    if (!isValid) {
        return res.status(400).send({ Error: 'Invalid Question' });
    }

    isValid = await validateUser(userId)
    if (!isValid) {
        return res.status(400).send({ Error: 'Invalid User' });
    }

    var user_data = new UserData(req.body);
    user_data.save(function (err, user_data) {
        if (err)
            res.send(err);
        else {
            res.status(202).send({ Success: 'User Data Accepted', Saved: user_data });
        }
    });

}

//add user_data also saving question_id,value,user_id,service_type
exports.saveUserDataPerQuestion = saveUserDataPerQuestion;

function validateService(service) {
    return Service.find({ name: service }).then(service => {
        if (service.length < 1) return false;
        service = service[0];
        return service.available;
    }).catch(err => {
        console.log(err); throw err;
    });
}

function validateQuestion(question) {
    return Question.find({ id: question }).then(question => {
        return question.length >= 1;
    }).catch(err => {
        console.log(err); throw err;
    });
}

function validateUser(user) {
    return User.find({ _id: user }).then(user => {
        return user.length >= 1;
    }).catch(err => {
        console.log(err); throw err;
    });
}





