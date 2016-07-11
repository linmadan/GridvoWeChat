'use strict';
var async = require('async');
var weChatCorpServiceAPI = require('wechat-corp-service');
var constant = require('./constant');

var createWeChatCorpServiceAPI = function (suiteName, suiteTicketManageService, suiteAccessTokenManageService, cb) {
    var getToken = function (callback) {
        var self = this;
        suiteAccessTokenManageService.getSuiteAccessToken(self.suiteId, (err, suiteAccessToken)=> {
            if (err || !suiteAccessToken) {
                callback(null, null);
                return;
            }
            if (suiteAccessToken && (new Date().getTime()) < (new Date(suiteAccessToken.expire)).getTime()) {
                callback(null, {
                    suite_access_token: suiteAccessToken.accessToken,
                    expires_in: suiteAccessToken.expire
                });
            } else {
                callback(null, null);
            }
        });
    };
    var saveToken = function (suiteAccessToken, callback) {
        var self = this;
        var suiteAccessTokenData = {};
        suiteAccessTokenData.suiteID = self.suiteId;
        suiteAccessTokenData.accessToken = suiteAccessToken.suite_access_token;
        suiteAccessTokenData.expire = new Date((new Date()).getTime() + 7190000);
        suiteAccessTokenManageService.saveSuiteAccessToken(suiteAccessTokenData, (err, isSuccess)=> {
            if (err) {
                callback(err);
                return;
            }
            if (!isSuccess) {
                callback(null);
                return;
            }
            callback(null);
        })
    };
    async.waterfall([function (cb) {
        suiteTicketManageService.getSuiteTicket(constant[suiteName].suiteID, cb);
    }], function (err, suiteTicket) {
        if (err) {
            cb(err);
            return;
        }
        if (!suiteTicket) {
            cb(null, null);
            return;
        }
        var api = new weChatCorpServiceAPI(constant[suiteName].suiteID,
            constant[suiteName].suiteSecret,
            suiteTicket.ticket,
            getToken,
            saveToken);
        cb(null, api);
    });
};

module.exports.createWeChatCorpServiceAPI = createWeChatCorpServiceAPI;