'use strict';
var _ = require('underscore');
var async = require('async');
var request = require('request');
var util = require('util');
var EventEmitter = require('events');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.__suiteAccessTokenManage__ = null;
    this.__httpRequest__ = request;
};

util.inherits(Service, EventEmitter);

Service.prototype.__getPreAuthCodeFromWeChatServer__ = function (suiteID, callback) {
    var self = this;
    async.waterfall([function (cb) {
        self.__suiteAccessTokenManage__.getLatestSuiteAccessToken(suiteID, cb);
    }, function (suiteAccessToken, cb) {
        if (!suiteAccessToken) {
            callback(null, null);
            return;
        }
        var url = `${constant.qyapiPrefix}service/get_pre_auth_code?suite_access_token=${suiteAccessToken}`;
        var data = {
            suite_id: suiteID
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
        if (body.pre_auth_code && body.errcode == "0" && body.errmsg == "ok") {
            callback(null, body.pre_auth_code);
        }
        else {
            callback(null, null);
        }
    });
};

Service.prototype.__getPermanentCodeFromWeChatServer__ = function (suiteID, authCode, callback) {
    var self = this;
    async.waterfall([function (cb) {
        self.__suiteAccessTokenManage__.getLatestSuiteAccessToken(suiteID, cb);
    }, function (suiteAccessToken, cb) {
        if (!suiteAccessToken) {
            callback(null, null);
            return;
        }
        var url = `${constant.qyapiPrefix}service/get_permanent_code?suite_access_token=${suiteAccessToken}`;
        var data = {
            suite_id: suiteID,
            auth_code: authCode
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
        callback(err, body);
    });
};

Service.prototype.getSuitePreAuthCode = function (suiteID, callback) {
    if (!suiteID) {
        callback(null, null);
        return;
    }
    var self = this;
    async.waterfall([function (cb) {
        self.__getPreAuthCodeFromWeChatServer__(suiteID, cb);
    }], function (err, preAuthCode) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, preAuthCode);
    });
};

Service.prototype.getAuthCorpSuiteInfo = function (suiteID, authCode, callback) {
    if (!suiteID) {
        callback(null, null);
        return;
    }
    var self = this;
    async.waterfall([function (cb) {
        self.__getPermanentCodeFromWeChatServer__(suiteID, authCode, cb);
    }], function (err, responseBody) {
        if (err) {
            callback(err, null);
            return;
        }
        if (!responseBody) {
            callback(err, null);
            return;
        }
        var authCorpSuiteInfoData = {};
        authCorpSuiteInfoData.corpID = responseBody.auth_corp_info.corpid;
        authCorpSuiteInfoData.permanentCode = responseBody.permanent_code;
        authCorpSuiteInfoData.accessToken = responseBody.access_token;
        authCorpSuiteInfoData.agents = {};
        for (let agentInfo of responseBody.auth_info.agent) {
            var agent = {};
            agent.agentid = agentInfo.agentid;
            authCorpSuiteInfoData.agents[agentInfo.appid.toString()] = agent;
        }
        callback(null, authCorpSuiteInfoData);
    });
};

Service.prototype.generateSuiteAuthURL = function (suiteID, preAuthCode, redirectURI, state, callback) {
    if (!suiteID || !preAuthCode || !redirectURI || !state) {
        callback(null, null);
        return;
    }
    var suiteAuthURL = `https://qy.weixin.qq.com/cgi-bin/loginpage?suite_id=${suiteID}&pre_auth_code=${preAuthCode}&redirect_uri=${redirectURI}&state=${state}`;
    callback(null, suiteAuthURL);
};

module.exports = Service;