'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');
var muk = require('muk');

describe('suiteAccessTokenManage service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('suiteAccessTokenManageService');
        });
    });
    describe('#saveSuiteAccessToken(suiteAccessTokenData,callback)', function () {
        context('save a suite access token', function () {
            it('save fail if no suiteID or no access token or no expire', function (done) {
                var suiteAccessTokenData = {};
                suiteAccessTokenData.suiteID = "";
                service.saveSuiteAccessToken(suiteAccessTokenData, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('save success', function (done) {
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
    });
    describe('#getLatestSuiteAccessToken(suiteID,callback)', function () {
        context('get suite access token', function () {
            it('get return null if request wechat server fail or other depend err', function (done) {
                var mockRequest = function (options, callback) {
                    var err = true;
                    callback(err, null);
                };
                muk(service, "__httpRequest__", mockRequest);
                var suiteID = "tj75d1122acf5ed4aa";
                service.getLatestSuiteAccessToken(suiteID, function (err, suiteAccessToken) {
                    _.isNull(suiteAccessToken).should.be.eql(true);
                    done();
                });
            });
            it('get success if all is ok', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, {suite_access_token: "accessToken"});
                };
                muk(service, "__httpRequest__", mockRequest);
                var suiteID = "tj75d1122acf5ed4aa";
                service.getLatestSuiteAccessToken(suiteID, function (err, suiteAccessToken) {
                    suiteAccessToken.should.be.eql("accessToken");
                    done();
                });
            });
            after(function () {
                muk.restore();
            });
        });
    });
});