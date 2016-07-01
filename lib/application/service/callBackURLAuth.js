'use strict';
var _ = require('underscore');
var util = require('util');
var EventEmitter = require('events');
var WeChatCrypto = require('wechat-crypto');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.__WeChatCrypto__ = new WeChatCrypto(constant.token, constant.encodingAESKey, constant.corpID);
};

util.inherits(Service, EventEmitter);

Service.prototype.authURL = function (authParameter, callback) {
    var echostr = null;
    if (!authParameter.signature || !authParameter.timestamp || !authParameter.nonce || !authParameter.encrypt) {
        callback(null, echostr);
    } else {
        var auth_signature = this.__WeChatCrypto__.getSignature(authParameter.timestamp, authParameter.nonce, authParameter.encrypt);
        if (authParameter.signature == auth_signature) {
            echostr = this.__WeChatCrypto__.decrypt(authParameter.encrypt).message;
            callback(null, echostr);
        }
        else {
            callback(null, echostr);
        }
    }
};

module.exports = Service;