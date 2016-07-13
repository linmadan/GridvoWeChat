'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

describe('authCorpSuiteProxy service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('authCorpSuiteProxyService');
        });
    });
    describe('#getAccessTokenFromWeChatServer(callback)', function () {
        context('get corp suite access token from wechat server', function () {
            it('return null if request server err or no access_token data', function (done) {
                service.getAccessTokenFromWeChatServer(function (err, accessTokenData) {
                    _.isNull(accessTokenData).should.be.eql(true);
                    done();
                });
            });
        });
    });
});