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
    context('auth call back url return echostr #authURL(urlParameter, callback)', function () {
        it('return null if urlParameter no signature,timestamp,nonce,encrypt', function (done) {
            var urlParameter = {};
            urlParameter.signature = "signature";
            service.authURL(urlParameter, function (err, echostr) {
                _.isNull(echostr).should.be.eql(true);
                done();
            });
        });
        it('return echostr if urlParameter is ok', function (done) {
            var urlParameter = {};
            urlParameter.signature = "signature";
            urlParameter.timestamp = new Date();
            urlParameter.nonce = "nonce";
            urlParameter.encrypt = "encrypt";
            service.authURL(urlParameter, function (err, echostr) {
                echostr.should.be.eql("echostr");
                done();
            });
        });
    });
});