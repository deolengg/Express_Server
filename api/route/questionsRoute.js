'use strict';

module.exports = function (app) {
    var questions = require('../controller/questionsController');

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    app.route('/questionaire/:service')
        .get(questions.provideQuestionairePerService);

    app.route('/services/questionaire')
        .get(questions.listQuestions)
        .post(questions.addQuestion);

}
