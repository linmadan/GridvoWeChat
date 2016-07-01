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

Service.prototype.authURL = function (urlParameter, callback) {
    var echostr = null;
    if (!urlParameter.signature || !urlParameter.timestamp || !urlParameter.nonce || !urlParameter.encrypt) {
        callback(null, echostr);
    } else {
        var auth_signature = this.__WeChatCrypto__.getSignature(urlParameter.timestamp, urlParameter.nonce, urlParameter.encrypt);
        if (urlParameter.signature == auth_signature) {
            echostr = this.__WeChatCrypto__.decrypt(urlParameter.encrypt);
            callback(null, echostr);
        }
        else {
            callback(null, echostr);
        }
    }
};

module.exports = Service;