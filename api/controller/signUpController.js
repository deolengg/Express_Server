'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var Users = require('../model/signUpModel');

let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port : 465,
    auth: {
    user: 'apikey',
    pass: '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'
  }
});
//got rid of AWS SES


// exports.listAll = function (req, res) {
//     Users.find({}, function (err, email) {
//         if (err)
//             res.send(err);
//         res.json(email);
//     });
// };

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
        //console.log(user.verification.verification_token);
        if (user.verification.verification_token == req.query.token) {
            user.verification.is_verified = true;
            user.date_verified = Date.now();
            
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
            from: 'donotreply@immigration-server.com',
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

        //console.log(req.body.email); //getting email 
        //console.log(req.body.recycle); // getting true or false

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
//Server	smtp.sendgrid.net
//Ports	
//25, 587	(for unencrypted/TLS connections)
//465	(for SSL connections)
//Username	apikey
//Password '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'