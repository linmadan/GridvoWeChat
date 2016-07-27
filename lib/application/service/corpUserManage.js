'use strict';
var _ = require('underscore');
var async = require('async');
var request = require('request');
var util = require('util');
var EventEmitter = require('events');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.__httpRequest__ = request;
};

util.inherits(Service, EventEmitter);

Service.prototype.getUserIDByCode = function (accessToken, code, callback) {
    if (!accessToken || !code) {
        callback(null, null);
    }
    var self = this;
    async.waterfall([function (cb) {
        var url = `${constant.qyapiPrefix}user/getuserinfo?access_token=${accessToken}&code=${code}`;
        var options = {
            method: "GET",
            url: url,
            json: true
        };
        self.__httpRequest__(options, cb);
    }], function (err, response, body) {
        if (err) {
            callback(err, null);
            return;
        }
        if (body.UserId || body.OpenId) {
            var userID = body.UserId ? body.UserId : body.OpenId;
            callback(null, userID);
        }
        else {
            callback(null, null);
        }
    });
};

module.exports = Service;