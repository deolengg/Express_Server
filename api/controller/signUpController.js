'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
let aws = require('aws-sdk');

aws.config.loadFromPath('./config.aws.json');

var Users = require('../model/signUpModel');

let transporter = nodemailer.createTransport({
    SES: new aws.SES({
        // apiVersion: '2010-12-01'
    })
});

//var transporter = nodemailer.createTransport({
//pool: true,
//host: 'email-smtp.us-east-1.amazonaws.com',
//port: 465,
//secure: true, // use SSL
//auth: {
//user: 'AKIAIN44MTM5224DSABA',
//pass: 'AjojW+KFGbPmmUIO69UPXs5F6eoGmOo8aD7xTDgIsKw2'
//}
//});

exports.listAll = function (req, res) {
    Users.find({}, function (err, email) {
        if (err)
            res.send(err);
        res.json(email);
    });
};

function generateVerificationToken() {
    return crypto.randomBytes(16).toString('hex');
}

exports.addUserEmail = function (req, res) {

    var user = new Users(req.body);

    user.verification.verification_token = generateVerificationToken();

    user.save(function (err, email) {
        if (err)
            res.send(err);
        sendVerificationEmail(req, user.verification.verification_token, email.email, (err) => {
            if (err) { console.log(err); return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + email.email + '.');
        });
    });
};

exports.verifyEmail = function (req, res) {
    Users.find({ email: req.query.email }, (err, users) => {
        if (err) { res.send("Err"); return }
        if (users.length == 0) { res.send("Invalid User"); return }
        let user = users[0];
        console.log(user.verification.verification_token);
        if (user.verification.verification_token == req.query.token) {
            user.verification.is_verified = true;
            user.date_verified = Date.now();
            user.recycle.is_recyclable = false; //once registered recycleable is set to false, cannot register again
            user.save();
            res.send("Verification Successful");
        } else {
            res.send("Invalid Token");
        }
    });
};


function sendVerificationEmail(req, token, email, cb) {
    let emailText = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/verify\/?token=' + token + '&email=' + email + '.\n';
        //console.log(emailText);
        var mailOptions = {
            from: 'er.jaskarandeol@gmail.com',
            to: email,
            subject: 'Account Verification Token',
            text: emailText
        };
        transporter.sendMail(mailOptions, function (err) {
            cb(err);
        });

}

exports.resendEmailVerification = function (req, res) {
    Users.find({ email: req.body.email }, (err, users) => {
        if (err) { res.send("Err"); return }
        if (users.length == 0) { return res.status(404).send("User Not Found"); }
        console.log(users);
        let user = users[0];

        console.log(req.body.email); //getting email 
        console.log(req.body.recycle); // getting true or false

        if (req.body.recycle === "true") {
            user.verification.verification_token = generateVerificationToken();
            user.save();
        }

        sendVerificationEmail(req, user.verification.verification_token, req.body.email, (err) => {
            if (err) { console.log(err); return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + req.body.email + '.');
        });

    });
};



//SMTP Username:
//AKIAIN44MTM5224DSABA
//SMTP Password:
//AjojW+KFGbPmmUIO69UPXs5F6eoGmOo8aD7xTDgIsKw2

//Server Name:	
//email-smtp.us-east-1.amazonaws.com
//Port:	25, 465 or 587
//Use Transport Layer Security (TLS):	Yes