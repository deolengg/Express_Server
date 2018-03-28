'use strict';

var mongoose = require('mongoose');
var Services = require('../model/servicesListModel');

exports.listServices = function (req, res) {
    Services.find({}, function (err, service) {
        if (err)
            res.send(err);
        res.json(service);
    });
};

exports.addService = function (req, res) {

    var service = new Services(req.body);

    service.save(function (err, service) {
        if (err)
            res.send(err);
        else {
            res.send('Service Added : ' + req.body.name);
        }
    });
};