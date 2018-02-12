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

exports.addUserEmail = function(req, res) {
    
    var user = new Users(req.body);
    user.verification.verification_token = crypto.randomBytes(16).toString('hex');

    user.save(function (err, email) {
        if (err)
            res.send(err);

            let emailText = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/verify\/?token='+user.verification.verification_token+ '&email='+email.email+'.\n';
            console.log(emailText);
        var mailOptions = {
            from: 'er.jaskarandeol@gmail.com',
            to: email.email,
            subject: 'Account Verification Token',
            text: emailText
        };
        transporter.sendMail(mailOptions, function (err) {
            console.log (err)
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + email + '.');
        });
        //res.json(email);
    });
};

exports.verifyEmail = function(req, res){
     Users.find({email: req.query.email}, (err, users) => {
         if (err) { res.send("Err"); return}
         if (users.length == 0) { res.send("Invalid User"); return}
         let user = users[0];
         console.log(user.verification.verification_token);
         if(user.verification.verification_token == req.query.token) {
             user.verification.is_verified = true;
             user.save();
             res.send("Verification Successful");
         } else {
             res.send("Invalid Token");
         }
     })
}

//SMTP Username:
//AKIAIN44MTM5224DSABA
//SMTP Password:
//AjojW+KFGbPmmUIO69UPXs5F6eoGmOo8aD7xTDgIsKw2

//Server Name:	
//email-smtp.us-east-1.amazonaws.com
//Port:	25, 465 or 587
//Use Transport Layer Security (TLS):	Yes