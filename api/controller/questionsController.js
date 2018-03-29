'use strict';

var mongoose = require('mongoose');
var Questions = require('../model/questionModel');
var Service = require('../model/servicesListModel');

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

    question.save(function (err, question) {
        if (err)
            res.send(err)
        else {
            res.send('Question Added : ' + req.body.id);
        }
    });
};


exports.newProvideQuestionairePerService = function (req, res) {
    //return which service is required  
    let serviceName = req.query.service; 
    Service.find({ name : serviceName }, (err, service) => { 
        if (err) { console.log(err); throw err; }
        if (service.length == 1){
            service = service [0];
            if (service.available == false) return res.send("Service Not Available");

            console.log("This Service is Available");
            console.log(typeof service.questions); 
           
            let questionsPromises = [];
            service.questions.forEach(question => {
                questionsPromises.push(Questions.findOne({id: question}));
            });

            Promise.all(questionsPromises).then(questions => {
                res.send(questions.map(ques => {
                    return (({id,type,format ,multiple,options,filter}) => ({id,type,format ,multiple,options,filter}))(ques);
                }));
            })
            //get service.questions = [] contains all questions
            //ID mapping
            //take service.questions [] then go to questions schema map question.ID 
            //return json of questions
        }
        else {
            console.log("Service Called : "+serviceName+" is Invalid");
            return res.status(404).send("Service Not Found : "+serviceName); 
        }
    });
};