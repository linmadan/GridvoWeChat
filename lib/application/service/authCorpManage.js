'use strict';
var _ = require('underscore');
var async = require('async');
var util = require('util');
var EventEmitter = require('events');
var AuthCorpSuiteInfo = require('../../domain/authCorpSuiteInfo');

function Service() {
    EventEmitter.call(this);
    this.__authCorpSuiteInfoRepository__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.saveAuthCorpSuiteInfo = function (authCorpSuiteInfoData, callback) {
    if (!authCorpSuiteInfoData.corpID || !authCorpSuiteInfoData.suiteID || !authCorpSuiteInfoData.permanentCode
        || !authCorpSuiteInfoData.accessToken || !authCorpSuiteInfoData.expire) {
        callback(null, false);
        return;
    }
    var authCorpSuiteInfo = new AuthCorpSuiteInfo(authCorpSuiteInfoData);
    this.__authCorpSuiteInfoRepository__.saveAuthCorpSuiteInfo(authCorpSuiteInfo, function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};

Service.prototype.getAuthCorpSuiteAccessToken = function (corpID, suiteID, callback) {
    if (!corpID || !suiteID) {
        callback(null, null);
        return;
    }
    this.__authCorpSuiteInfoRepository__.getAuthCorpSuiteInfo(corpID, suiteID, function (err, authCorpSuiteInfo) {
        if (err) {
            callback(err, null);
            return;
        }
        var accessTokenData = {};
        if (authCorpSuiteInfo) {
            accessTokenData.accessToken = authCorpSuiteInfo.accessToken;
            accessTokenData.expire = authCorpSuiteInfo.expire;
        }
        callback(null, accessTokenData);
    });
};

Service.prototype.getAuthCorpSuitePermanentCode = function (corpID, suiteID, callback) {
    if (!corpID || !suiteID) {
        callback(null, null);
        return;
    }
    this.__authCorpSuiteInfoRepository__.getAuthCorpSuiteInfo(corpID, suiteID, function (err, authCorpSuiteInfo) {
        if (err) {
            callback(err, null);
            return;
        }
        var permanentCode = null;
        if (authCorpSuiteInfo) {
            permanentCode = authCorpSuiteInfo.permanentCode;
        }
        callback(null, permanentCode);
    });
};

Service.prototype.updateAuthCorpSuiteAccessToken = function (corpID, suiteID, accessTokenData, callback) {
    if (!corpID || !suiteID) {
        callback(null, false);
        return;
    }
    var self = this;
    async.waterfall([function (cb) {
        self.__authCorpSuiteInfoRepository__.getAuthCorpSuiteInfo(corpID, suiteID, cb);
    }, function (authCorpSuiteInfo, cb) {
        if (!authCorpSuiteInfo) {
            cb(null, false);
            return;
        }
        authCorpSuiteInfo.accessToken = accessTokenData.accessToken;
        authCorpSuiteInfo.expire = accessTokenData.expire;
        self.__authCorpSuiteInfoRepository__.saveAuthCorpSuiteInfo(authCorpSuiteInfo, cb);
    }], function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    });
};

Service.prototype.removeAuthCorpSuiteInfo = function (corpID, suiteID, callback) {
    if (!corpID || !suiteID) {
        callback(null, false);
        return;
    }
    this.__authCorpSuiteInfoRepository__.removeAuthCorpSuiteInfo(corpID, suiteID, function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    })
};
module.exports = Service;