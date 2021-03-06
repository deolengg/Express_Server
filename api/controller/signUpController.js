'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var Users = require('../model/signUpModel');
var UserData = require('../model/userDataModel');
var Question = require('../model/questionModel');
var Service = require('../model/servicesListModel');

var path = require('path');

var needle = require('needle');

let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    auth: {
        user: 'apikey',
        pass: 'Your Key'
    }
});

function generateVerificationToken() {
    return crypto.randomBytes(16).toString('hex');
}

exports.addUserEmail = function (req, res) {
    Users.find({ email: req.body.email }, (err, users) => {
        if (err) { res.send("Err"); return }
        if (users.length == 0) {
            var user = new Users(req.body);

            user.verification.verification_token = generateVerificationToken();

            user.save(function (err, email) {
                if (err)
                    res.send(err);
                sendVerificationEmail(req, user.verification.verification_token, email.email, (err) => {
                    if (err) { console.log(err); return res.status(500).send({ msg: err.message }); }
                    res.status(200).send({ 
                        'A verification email has been sent to ' : email.email 
                    });
                });
            });
        }
        else {
            res.status(400).send({ Error : 'Invalid Request',
                Error : 'This email is already Registered'
            });
        }
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
            res.redirect('http://localhost:3000/thankyou');
        } else {
            res.status(400).send({ Error : 'Invalid Token' });
        }
    });
};


function sendVerificationEmail(req, token, email, cb) {
    let emailText = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/verify\/?token=' + token + '&email=' + email + '.\n';
    //console.log(emailText);
    var mailOptions = {
        from: 'donotreply@Express-Server.com',
        to: email,
        subject: 'Account Verification Token',
        text: emailText
    };
    transporter.sendMail(mailOptions, function (err) {
        cb(err);
    });

}


exports.linkedinLogin = function (req, res) {
    let code = req.query.code;
    console.log(code);
    needle('post', 'https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3001/login/linkedin',
        client_id: 'Your ID',
        client_secret: 'Your Key'
    })
        .then(function (resp) {
            let resp_body = resp.body;
            if (resp_body.error) {
                return res.status(400).send(resp_body);
            }
            // Save access token in db
            return getProfileFromLinkedIn(resp_body.access_token).then(profile => {
                // save profile info in db
                Users.find({ "email" : profile.emailAddress }, (err, user) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if (user.length == 0) {
                        user = new Users({ email: profile.emailAddress, verification: true });
                    } else {
                        user = user[0];
                    }
                    user.first_name = profile.firstName;
                    user.last_name = profile.lastName;
                    user.save();
                
                    res.sendFile(path.resolve('./public/index.html'));
                    // res.redirect(url.format({
                    //     pathname:"/login",
                    // }))
                });
            });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(400).send(err);
        });
}

function getProfileFromLinkedIn(token) {
    return needle('get', 'https://api.linkedin.com/v1/people/~:(id,picture-url,first-name,last-name,email-address,location)', { format: 'json' }, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }).then((resp) => {
        console.log(resp.body);
        return resp.body;
    });
}

exports.facebookLogin = function (req, res) {
    let code = req.query.code;
    console.log(code);
    needle.request('get', 'https://graph.facebook.com/v2.12/oauth/access_token', {
        client_id: 'Your ID',
        redirect_uri: 'http://localhost:3001/login/facebook',
        client_secret: 'Your Key',
        code: code
    }, function (err, resp) {
        if (err) {
            console.log(err);
            return res.status(400).send(resp_body);
        }
        let resp_body = resp.body;
        if (resp_body.error) {
            return res.status(400).send(resp_body);
        }
        console.log(resp_body);
        let token = resp_body.access_token;
        // Save access token in db
        return getProfileFromFacebook(resp_body.access_token).then(profile => {
            // save profile info in db
            Users.find({ "email": profile.email }, (err, user) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (user.length == 0) {
                    user = new Users({ email: profile.email, verification: true });
                } else {
                    user = user[0];
                }
                user.first_name = profile.first_name;
                user.last_name = profile.last_name;
                user.save();

                res.status(202).end();
            });

        });
    });
}
function getProfileFromFacebook(token) {
    return needle('get', 'https://graph.facebook.com/v2.12/me?fields=id,first_name,last_name,email,location', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }).then((resp) => {
        console.log(resp.body);
        return resp.body;
    });
}

exports.resendEmailVerification = function (req, res) {
    Users.find({ email: req.body.email }, (err, users) => {
        if (err) { res.send("Err"); return }
        if (users.length == 0) { return res.status(404).send({Error : 'User Not Found'}); }
        //console.log(users);
        let user = users[0];

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

