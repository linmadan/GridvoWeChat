'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');
var muk = require('muk');

describe('authCorpManage service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('authCorpManageService');
        });
    });
    describe('#saveAuthCorpSuiteInfo(authCorpSuiteInfoData,callback)', function () {
        context('save auth corp suite info', function () {
            it('save fail if no some info', function (done) {
                var authCorpSuiteInfoData = {};
                authCorpSuiteInfoData.corpID = "";
                service.saveAuthCorpSuiteInfo(authCorpSuiteInfoData, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('save success', function (done) {
                var authCorpSuiteInfoData = {};
                authCorpSuiteInfoData.corpID = "corpID";
                authCorpSuiteInfoData.suiteID = "suiteID";
                authCorpSuiteInfoData.permanentCode = "permanentCode";
                authCorpSuiteInfoData.accessToken = "accessToken";
                authCorpSuiteInfoData.expire = new Date();
                service.saveAuthCorpSuiteInfo(authCorpSuiteInfoData, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getAuthCorpLatesSuiteAccessToken(authCorpID, suiteID, callback)', function () {
        context('get auth corp suite access token', function () {
            it('is success if all is ok ', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, {access_token: "accessToken"});
                };
                muk(service, "__httpRequest__", mockRequest);
                var authCorpID = "corpID";
                var suiteID = "suiteID";
                service.getAuthCorpLatesSuiteAccessToken(authCorpID, suiteID, function (err, accessToken) {
                    accessToken.should.be.eql("accessToken");
                    done();
                });
            });
            after(function () {
                muk.restore();
            });
        });
    });
    describe('#getAuthCorpSuiteAgentInfo(authCorpID, suiteID, appID, callback)', function () {
        context('get auth corp suite agent info', function () {
            it('return null if corp suite is no this appid ', function (done) {
                var authCorpID = "corpID";
                var suiteID = "suiteID";
                var appID = "noAppID";
                service.getAuthCorpSuiteAgentInfo(authCorpID, suiteID, appID, function (err, agentInfo) {
                    _.isNull(agentInfo).should.be.eql(true);
                    done();
                });
            });
            it('is ok', function (done) {
                var authCorpID = "corpID";
                var suiteID = "suiteID";
                var appID = "1";
                service.getAuthCorpSuiteAgentInfo(authCorpID, suiteID, appID, function (err, agentInfo) {
                    agentInfo.agentID.should.be.eql(1);
                    done();
                });
            });
        });
    });
    describe('#removeAuthCorpSuiteInfo(corpID, suiteID, callback)', function () {
        context('remove auth corp suite info', function () {
            it('is success', function (done) {
                var corpID = "corpID";
                var suiteID = "suiteID";
                service.removeAuthCorpSuiteInfo(corpID, suiteID, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
});