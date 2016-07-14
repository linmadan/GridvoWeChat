'use strict';
var _ = require('underscore');
var async = require('async');
var request = require('request');
var util = require('util');
var EventEmitter = require('events');
var SuiteAccessToken = require('../../domain/suiteAccessToken');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.__httpRequest__ = request;
    this.__suiteTicketManage__ = null;
    this.__suiteAccessTokenRepository__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.__getSuiteAccessTokenFromWeChatServer__ = function (suiteID, suiteSecret, suiteTicket, callback) {
    var self = this;
    async.waterfall([function (cb) {
        var url = `${constant.qyapiPrefix}service/get_suite_token`;
        var data = {
            suite_id: suiteID,
            suite_secret: suiteTicket,
            suite_ticket: suiteTicket
        };
        var options = {
            method: "POST",
            url: url,
            body: data,
            json: true
        };
        self.__httpRequest__(options, cb);
    }], function (err, response, body) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, body.suite_access_token);
        var suiteAccessTokenData = {};
        suiteAccessTokenData.suiteID = suiteID;
        suiteAccessTokenData.accessToken = body.suite_access_token;
        suiteAccessTokenData.expire = new Date((new Date()).getTime() + 7190000);
        self.saveSuiteAccessToken(suiteAccessTokenData, (err, isSuccess)=> {
            if (err || !isSuccess) {
                console.log("save suite accessToken fail");
            }
            else {
                console.log("save suite accessToken success");
            }
        });
    });
};

Service.prototype.saveSuiteAccessToken = function (suiteAccessTokenData, callback) {
    if (!suiteAccessTokenData.suiteID || !suiteAccessTokenData.accessToken || !suiteAccessTokenData.expire) {
        callback(null, false);
    } else {
        var suiteAccessToken = new SuiteAccessToken(suiteAccessTokenData);
        this.__suiteAccessTokenRepository__.saveSuiteAccessToken(suiteAccessToken, function (err, isSuccess) {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    }
};

Service.prototype.getLatestSuiteAccessToken = function (suiteName, callback) {
    if (!suiteName) {
        callback(null, null);
        return;
    }
    var self = this;
    var suiteID = constant[suiteName].suiteID;
    var suiteSecret = constant[suiteName].suiteSecret;
    async.waterfall([function (cb) {
        self.__suiteAccessTokenRepository__.getSuiteAccessToken(suiteID, cb);
    }, function (suiteAccessToken, cb) {
        if (suiteAccessToken && (new Date()).getTime() < (new Date(suiteAccessToken.expire)).getTime()) {
            callback(null, suiteAccessToken.accessToken);
            return;
        }
        self.__suiteTicketManage__.getSuiteTicket(suiteID, cb);
    }, function (suiteTicket, cb) {
        if (!suiteTicket) {
            callback(null, null);
            return;
        }
        self.__getSuiteAccessTokenFromWeChatServer__(suiteID, suiteSecret, suiteTicket.ticket, cb);
    }], function (err, suiteAccessToken) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, suiteAccessToken);
    });
};

module.exports = Service;