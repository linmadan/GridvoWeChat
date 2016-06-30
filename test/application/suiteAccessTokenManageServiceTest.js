'use strict';
var bearcat = require('bearcat');
var should = require('should');

describe('suiteAccessTokenManage service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('suiteAccessTokenManageService');
        });
    });
    context('save a suite access token #saveSuiteAccessToken(suiteAccessTokenData,callback)', function () {
        it('save suite access token fail if no suiteID or no access token or no expire', function (done) {
            var suiteAccessTokenData = {};
            suiteAccessTokenData.suiteID = "";
            service.saveSuiteAccessToken(suiteAccessTokenData, function (err, isSuccess) {
                isSuccess.should.be.eql(false);
                done();
            });
        });
        it('save suite access token success', function (done) {
            var suiteAccessTokenData = {};
            suiteAccessTokenData.suiteID = "suiteID";
            suiteAccessTokenData.accessToken = "AccessToken";
            suiteAccessTokenData.expire = new Date();
            service.saveSuiteAccessToken(suiteAccessTokenData, function (err, isSuccess) {
                isSuccess.should.be.eql(true);
                done();
            });
        });
    });
    context('get suite access token #getSuiteAccessToken(suiteID,callback)', function () {
        it('get suite access token for suite id', function (done) {
            var suiteID = "suiteID";
            service.getSuiteAccessToken(suiteID, function (err, suiteAccessTokenData) {
                suiteAccessTokenData.suiteID.should.be.eql("suiteID");
                suiteAccessTokenData.accessToken.should.be.eql("AccessToken");
                done();
            });
        });
    });
});