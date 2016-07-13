'use strict';
var _ = require('underscore');
var async = require('async');
var util = require('util');
var EventEmitter = require('events');

function Service(corpID, suiteID) {
    EventEmitter.call(this);
    this.corpID = corpID;
    this.suiteID = suiteID;
    this.accessToken = null;
    this.__httpRequest__ = null;
    this.__authCorpManage__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.getAccessTokenFromWeChatServer = function (callback) {
    callback(null, null);
};

module.exports = Service;