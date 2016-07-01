'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

describe('callBackURLAuth service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('callBackURLAuthService');
        });
    });
    context('auth call back url return echostr #authURL(authParameter, callback)', function () {
        it('return null if urlParameter no signature,timestamp,nonce,encrypt', function (done) {
            var authParameter = {};
            authParameter.signature = "signature";
            service.authURL(authParameter, function (err, echostr) {
                _.isNull(echostr).should.be.eql(true);
                done();
            });
        });
        it('return echostr if urlParameter is ok', function (done) {
            var authParameter = {};
            authParameter.signature = "signature";
            authParameter.timestamp = new Date();
            authParameter.nonce = "nonce";
            authParameter.encrypt = "encrypt";
            service.authURL(authParameter, function (err, echostr) {
                echostr.should.be.eql("echostr");
                done();
            });
        });
    });
});