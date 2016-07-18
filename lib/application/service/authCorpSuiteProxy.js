'use strict';
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');
var request = require('request');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.__httpRequest__ = request;
    this.__authCorpManage__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.createSuiteApp = function (authCorpID, suiteID, appID, appContent, callback) {
    var self = this;
    async.waterfall([function (cb) {
        self.__authCorpManage__.getAuthCorpLatesSuiteAccessToken(authCorpID, suiteID, cb);
    }, function (accessToken, cb) {
        if (!accessToken) {
            callback(null, false);
            return;
        }
        var url = `${constant.qyapiPrefix}menu/reate?access_token=${accessToken}&agentid=1`;
        var data = appContent.menu ? appContent.menu : {};
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