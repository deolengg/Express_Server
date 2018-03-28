'use strict';

var mongoose = require('mongoose');
var Questions = require('../model/questionModel');

//list all questions
exports.listQuestions = function (req, res) {
    Questions.find({}, function (err, questions) {
        if (err)
            res.send(err);
        res.json(questions);
    });
};
//add question
exports.addQuestion = function (req, res) {
    var question = new Questions(req.body);
    question.save(function( err, question){
        if (err)
            res.send(err)
            else {
                res.send('Question Added : ' + req.body.id);
            }
    });
};

exports.provideQuestionairePerService = function(req,res){
    //return which service is required
    res.send('Service Required : ' +req.query.service);

}