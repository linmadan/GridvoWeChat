'use strict';
var _ = require('underscore');
var async = require('async');
var request = require('request');
var util = require('util');
var EventEmitter = require('events');
var AuthCorpSuiteInfo = require('../../domain/authCorpSuiteInfo');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.__authCorpSuiteInfoRepository__ = null;
    this.__suiteAccessTokenManage__ = null;
    this.__httpRequest__ = request;
};

util.inherits(Service, EventEmitter);

Service.prototype.__getAuthCorpSuiteAccessTokenFromWeChatServer__ = function (authCorpID, suiteID, permanentCode, callback) {
    var self = this;
    async.waterfall([function (cb) {
        self.__suiteAccessTokenManage__.getLatestSuiteAccessToken(suiteID, cb);
    }, function (suiteAccessToken, cb) {
        if (!suiteAccessToken) {
            callback(null, null);
            return;
        }
        var url = `${constant.qyapiPrefix}service/get_corp_token?suite_access_token=${suiteAccessToken}`;
        var data = {
            suite_id: suiteID,
            auth_corpid: authCorpID,
            permanent_code: permanentCode
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
        callback(null, body.access_token);
    });
};

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

Service.prototype.getAuthCorpLatesSuiteAccessToken = function (authCorpID, suiteID, callback) {
    if (!authCorpID || !suiteID) {
        callback(null, null);
        return;
    }
    var self = this;
    var _authCorpSuiteInfo;
    async.waterfall([function (cb) {
        self.__authCorpSuiteInfoRepository__.getAuthCorpSuiteInfo(authCorpID, suiteID, cb);
    }, function (authCorpSuiteInfo, cb) {
        if (!authCorpSuiteInfo || !authCorpSuiteInfo.accessToken || !authCorpSuiteInfo.expire || !authCorpSuiteInfo.permanentCode) {
            callback(null, null);
            return;
        }
        if (authCorpSuiteInfo.accessToken && (new Date()).getTime() < (new Date(authCorpSuiteInfo.expire)).getTime()) {
            callback(null, authCorpSuiteInfo.accessToken);
            return;
        }
        _authCorpSuiteInfo = authCorpSuiteInfo;
        self.__getAuthCorpSuiteAccessTokenFromWeChatServer__(authCorpID, suiteID, authCorpSuiteInfo.permanentCode, cb);
    }], function (err, accessToken) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, accessToken);
        _authCorpSuiteInfo.accessToken = accessToken;
        _authCorpSuiteInfo.expire = new Date((new Date()).getTime() + 7190000);
        self.__authCorpSuiteInfoRepository__.saveAuthCorpSuiteInfo(_authCorpSuiteInfo, (err, isSuccess)=> {
            if (err || !isSuccess) {
                console.log("updat auth corp suite accessToken fail");
            }
            else {
                console.log("updat auth corp suite accessToken success");
            }
        });
    });
};

Service.prototype.removeAuthCorpSuiteInfo = function (authCorpID, suiteID, callback) {
    if (!authCorpID || !suiteID) {
        callback(null, false);
        return;
    }
    this.__authCorpSuiteInfoRepository__.removeAuthCorpSuiteInfo(authCorpID, suiteID, function (err, isSuccess) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, isSuccess);
    })
};
module.exports = Service;