'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

describe('parseCallBackData service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('parseCallBackDataService');
        });
    });
    describe('#parse(parseParameter, callback)', function () {
        context('parse call back data from wechat server', function () {
            it('return null if parseParameter no signature,timestamp,nonce,cbXMLString', function (done) {
                var parseParameter = {};
                parseParameter.signature = "signature";
                service.parse(parseParameter, function (err, data) {
                    _.isNull(data).should.be.eql(true);
                    done();
                });
            });
            it('return data if parseParameter is ok', function (done) {
                var parseParameter = {};
                parseParameter.signature = "signature";
                parseParameter.timestamp = new Date();
                parseParameter.nonce = "nonce";
                parseParameter.cbXMLString = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><AgentID><![CDATA[toAgentID]]></AgentID><Encrypt><![CDATA[msg_encrypt]]></Encrypt></xml>";
                service.parse(parseParameter, function (err, data) {
                    data.ToUserName.should.be.eql("userID");
                    data.MsgType.should.be.eql("event");
                    done();
                });
            });
        });
    });
});