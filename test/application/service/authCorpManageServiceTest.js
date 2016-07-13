'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

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
    describe('#getAuthCorpSuiteAccessToken(corpID, suiteID, callback)', function () {
        context('get auth corp suite access token', function () {
            it('is ok', function (done) {
                var corpID = "corpID";
                var suiteID = "suiteID";
                service.getAuthCorpSuiteAccessToken(corpID, suiteID, function (err, accessTokenData) {
                    accessTokenData.accessToken.should.be.eql("accessToken");
                    done();
                });
            });
        });
    });
    describe('#getAuthCorpSuitePermanentCode(corpID, suiteID, callback)', function () {
        context('get auth corp suite permanent code', function () {
            it('is ok', function (done) {
                var corpID = "corpID";
                var suiteID = "suiteID";
                service.getAuthCorpSuitePermanentCode(corpID, suiteID, function (err, permanentCode) {
                    permanentCode.should.be.eql("permanentCode");
                    done();
                });
            });
        });
    });
    describe('#updateAuthCorpSuiteAccessToken(corpID, suiteID, accessTokenData, callback)', function () {
        context('update auth corp suite access token', function () {
            it('update fail if no this corp or suite', function (done) {
                var corpID = "noCorpID";
                var suiteID = "suiteID";
                var accessTokenData = {};
                service.updateAuthCorpSuiteAccessToken(corpID, suiteID, accessTokenData, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('update success', function (done) {
                var corpID = "corpID";
                var suiteID = "suiteID";
                var accessTokenData = {};
                service.updateAuthCorpSuiteAccessToken(corpID, suiteID, accessTokenData, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
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