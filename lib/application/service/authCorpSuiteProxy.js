'use strict';
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');
var request = require('request');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.authCorpID = null;
    this.suiteName = null;
    this.__httpRequest__ = request;
    this.__authCorpManage__ = null;
    this.__suiteAccessTokenManage__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.__getLatestAccessToken__ = function (callback) {
    var self = this;
    async.waterfall([function (cb) {
        self.__authCorpManage__.getAuthCorpSuiteAccessToken(self.authCorpID, constant[self.suiteName].suiteID, cb);
    }, function (accessToken, cb) {
        if (accessToken && (new Date()).getTime() < (new Date(accessToken.expire)).getTime()) {
            callback(null, accessToken.accessToken);
            return;
        }
        self.__getAccessTokenFromWeChatServer__(cb);
    }], function (err, accessToken) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, accessToken);
    });
};

Service.prototype.__getAccessTokenFromWeChatServer__ = function (callback) {
    var self = this;
    var permanentCode;
    async.waterfall([function (cb) {
        self.__authCorpManage__.getAuthCorpSuitePermanentCode(self.authCorpID, constant[self.suiteName].suiteID, cb);
    }, function (permanentCode, cb) {
        if (!permanentCode) {
            callback(null, null);
            return;
        }
        permanentCode = permanentCode;
        self.__suiteAccessTokenManage__.getLatestSuiteAccessToken(self.suiteName, cb);
    }, function (suiteAccessToken, cb) {
        if (!suiteAccessToken) {
            callback(null, null);
            return;
        }
        var url = `${constant.qyapiPrefix}service/get_corp_token?suite_access_token=${suiteAccessToken}`;
        var data = {
            suite_id: constant[self.suiteName].suiteID,
            auth_corpid: self.authCorpID,
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
        var accessTokenData = {};
        accessTokenData.accessToken = body.access_token;
        accessTokenData.expire = new Date((new Date()).getTime() + 7190000);
        self.__authCorpManage__.updateAuthCorpSuiteAccessToken(self.authCorpID, constant[self.suiteName].suiteID, accessTokenData, (err, isSuccess)=> {
            if (err || !isSuccess) {
                console.log("updat auth corp suite accessToken fail");
            }
            else {
                console.log("updat auth corp suite accessToken success");
            }
        });
    });
};

Service.prototype.createApp = function (appName, callback) {
    var self = this;
    async.waterfall([function (cb) {
        self.__getLatestAccessToken__(cb);
    }, function (accessToken, cb) {
        if (!accessToken) {
            callback(null, false);
            return;
        }
        var url = `${constant.qyapiPrefix}menu/reate?access_token=${accessToken}&agentid=1`;
        var data = constant[self.suiteName][appName].menu;
        var options = {
            method: "POST",
            url: url,
            body: data,
            json: true
        };
        self.__httpRequest__(options, cb);
    }], function (err, response, body) {
        if (err) {
            callback(err, false);
            return;
        }
        callback(null, (body.errcode == 0 && body.errmsg == "ok"));
    });
};

module.exports = Service;