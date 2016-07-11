'use strict';
var _ = require('underscore');
var util = require('util');
var EventEmitter = require('events');
var SuiteAccessToken = require('../../domain/suiteAccessToken');

function Service() {
    EventEmitter.call(this);
    this.__suiteAccessTokenRepository__ = null;
};

util.inherits(Service, EventEmitter);

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
Service.prototype.getSuiteAccessToken = function (suiteID, callback) {
    if (!suiteID) {
        callback(null, null);
    } else {
        this.__suiteAccessTokenRepository__.getSuiteAccessToken(suiteID, function (err, suiteAccessToken) {
            if (err) {
                callback(err, null);
                return;
            }
            var suiteAccessTokenData = {};
            if (suiteAccessToken) {
                suiteAccessTokenData.suiteID = suiteAccessToken.suiteID;
                suiteAccessTokenData.accessToken = suiteAccessToken.accessToken;
                suiteAccessTokenData.expire = suiteAccessToken.expire;
            }
            callback(null, suiteAccessTokenData);
        });
    }
};

module.exports = Service;