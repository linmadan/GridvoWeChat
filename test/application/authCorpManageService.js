'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');

describe('authCorpManage service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('authCorpManageService');
        });
    });
    context('save auth corp info #saveAuthCorp(authCorp,callback)', function () {
        it('save auth corp info fail if no some info', function (done) {
            var authCorpData = {};
            authCorpData.corpID = "";
            service.saveAuthCorp(authCorpData, function (err, isSuccess) {
                isSuccess.should.be.eql(false);
                done();
            });
        });
        it('save auth corp info success', function (done) {
            var authCorpData = {};
            authCorpData.corpID = "corpID";
            authCorpData.permanentCode = "permanentCode";
            authCorpData.accessToken = "accessToken";
            authCorpData.accessTokenExpire = new Date();
            service.saveAuthCorp(authCorpData, function (err, isSuccess) {
                isSuccess.should.be.eql(true);
                done();
            });
        });
    });
    context('get corp access token #getAuthCorpAccessToken(corpID,callback)', function () {
        it('get auth corp access token for corp id', function (done) {
            var corpID = "corpID";
            service.getAuthCorpAccessToken(corpID, function (err, accessTokenData) {
                accessTokenData.accessToken.should.be.eql("accessToken");
                done();
            });
        });
    });
    context('get corp permanent code #getPermanentCode(corpID,callback)', function () {
        it('get corp permanent code for corp id', function (done) {
            var corpID = "corpID";
            service.getPermanentCode(corpID, function (err, permanentCode) {
                permanentCode.should.be.eql("permanentCode");
                done();
            });
        });
    });
    context('update corp access token #updateAuthCorpAccessToken(corpID, accessTokenData, callback)', function () {
        it('update auth corp access token fail if no this corp', function (done) {
            var corpID = "noCorpID";
            var accessTokenData = {};
            service.updateAuthCorpAccessToken(corpID, accessTokenData, function (err, isSuccess) {
                isSuccess.should.be.eql(false);
                done();
            });
        });
        it('update auth corp access token success for corp id', function (done) {
            var corpID = "corpID";
            var accessTokenData = {};
            service.updateAuthCorpAccessToken(corpID, accessTokenData, function (err, isSuccess) {
                isSuccess.should.be.eql(true);
                done();
            });
        });
    });
});