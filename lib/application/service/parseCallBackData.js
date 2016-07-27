'use strict';
var _ = require('underscore');
var async = require('async');
var util = require('util');
var EventEmitter = require('events');
var xml2js = require('xml2js');
var WeChatCrypto = require('wechat-crypto');
var constant = require('../util/constant');

function Service() {
    EventEmitter.call(this);
    this.__WeChatCrypto__ = new WeChatCrypto(constant.token, constant.encodingAESKey, constant.corpID);
};

util.inherits(Service, EventEmitter);

Service.prototype.parse = function (parseParameter, callback) {
    if (!parseParameter.signature || !parseParameter.timestamp || !parseParameter.nonce || !parseParameter.cbXMLString) {
        callback(null, null);
        return;
    }
    var self = this;
    var formatMessage = function (result) {
        var message = {};
        if (typeof result === 'object') {
            for (var key in result) {
                if (!Array.isArray(result[key]) || result[key].length === 0) {
                    continue;
                }
                if (result[key].length === 1) {
                    var val = result[key][0];
                    if (typeof val === 'object') {
                        message[key] = formatMessage(val);
                    } else {
                        message[key] = (val || '').trim();
                    }
                } else {
                    message[key] = [];
                    result[key].forEach(function (item) {
                        message[key].push(formatMessage(item));
                    });
                }
            }
        }
        return message;
    };
    async.waterfall([function (cb) {
        xml2js.parseString(parseParameter.cbXMLString, {trim: true}, cb);
    }, function (result, cb) {
        var xml = formatMessage(result.xml);
        var encryptMessage = xml.Encrypt;
        var auth_signature = self.__WeChatCrypto__.getSignature(parseParameter.timestamp, parseParameter.nonce, encryptMessage);
        if (parseParameter.signature != auth_signature) {
            callback(null, null);
            return;
        }
        var decrypted = self.__WeChatCrypto__.decrypt(encryptMessage);
        var messageXMLString = decrypted.message;
        xml2js.parseString(messageXMLString, {trim: true}, cb);
    }], function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        var data = formatMessage(result.xml);
        callback(null, data);
    });
};

module.exports = Service;