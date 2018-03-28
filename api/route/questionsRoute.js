'use strict';

module.exports = function (app) {
    var questions = require('../controller/questionsController');
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
      
    app.route('/services/questionaire')
    .get(questions.listQuestions) // simply listing all questions
    .post(questions.addQuestion); // adding question to Mongodb

    app.route('/questionnaire/:service')// provding questionaire for provided services 
    .get(questions.provideQuestionairePerService);
    }

  
    