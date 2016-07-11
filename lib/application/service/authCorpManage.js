'use strict';
var _ = require('underscore');
var async = require('async');
var util = require('util');
var EventEmitter = require('events');
var AuthCorp = require('../../domain/authCorp');

function Service() {
    EventEmitter.call(this);
    this.__authCorpRepository__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.saveAuthCorp = function (authCorpData, callback) {
    if (!authCorpData.corpID || !authCorpData.permanentCode || !authCorpData.accessToken || !authCorpData.accessTokenExpire) {
        callback(null, false);
    } else {
        var authCorp = new AuthCorp(authCorpData);
        this.__authCorpRepository__.saveAuthCorp(authCorp, function (err, isSuccess) {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    }
};

Service.prototype.getAuthCorpAccessToken = function (corpID, callback) {
    if (!corpID) {
        callback(null, null);
    } else {
        this.__authCorpRepository__.getAuthCorp(corpID, function (err, authCorp) {
            if (err) {
                callback(err, null);
                return;
            }
            var accessTokenData = {};
            if (authCorp) {
                accessTokenData.accessToken = authCorp.accessToken;
                accessTokenData.expire = authCorp.accessTokenExpire;
            }
            callback(null, accessTokenData);
        });
    }
};

Service.prototype.getPermanentCode = function (corpID, callback) {
    if (!corpID) {
        callback(null, null);
    } else {
        this.__authCorpRepository__.getAuthCorp(corpID, function (err, authCorp) {
            if (err) {
                callback(err, null);
                return;
            }
            var permanentCode = null;
            if (authCorp) {
                permanentCode = authCorp.permanentCode;
            }
            callback(null, permanentCode);
        });
    }
};

Service.prototype.updateAuthCorpAccessToken = function (corpID, accessTokenData, callback) {
    if (!corpID) {
        callback(null, false);
        return;
    }
    var self = this;
    async.waterfall([function (cb) {
        self.__authCorpRepository__.getAuthCorp(corpID, cb);
    }, function (authCorp, cb) {
        if (!authCorp) {
            cb(null, false);
            return;
        }
        authCorp.accessToken = accessTokenData.accessToken;
        authCorp.accessTokenExpire = accessTokenData.expire;
        self.__authCorpRepository__.saveAuthCorp(authCorp, cb);
    }], function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};

module.exports = Service;