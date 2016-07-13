'use strict';
var MongoClient = require('mongodb').MongoClient;
var bearcat = require('bearcat');
var _ = require('underscore');
var should = require('should');
var AuthCorpSuiteInfo = require('../../../lib/domain/authCorpSuiteInfo');

describe('auth corp suite info repository MongoDB use case test', function () {
    var Repository;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            Repository = bearcat.getBean('authCorpSuiteInfoRepository');
        });
    });
    describe('#saveAuthCorpSuiteInfo(authCorpSuiteInfo, cb)', function () {
        context('save a auth corp suite info', function () {
            it('should return true if save success', function (done) {
                var authCorpSuiteInfo = new AuthCorpSuiteInfo({
                    corpID: "corpID",
                    suiteID: "suiteID",
                    permanentCode: "permanentCode",
                    accessToken: "accessToken",
                    accessTokenExpire: new Date()
                });
                Repository.saveAuthCorpSuiteInfo(authCorpSuiteInfo, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getAuthCorpSuiteInfo(corpID, suiteID, cb)', function () {
        context('get a auth corp suite info for corp id and suite id', function () {
            it('should return null if no this auth corp', function (done) {
                var corpID = "noCorpID";
                var suiteID = "noSuiteID";
                Repository.getAuthCorpSuiteInfo(corpID, suiteID, function (err, authCorpSuiteInfo) {
                    _.isNull(authCorpSuiteInfo).should.be.eql(true);
                    done();
                });
            });
            it('should return auth corp suite info', function (done) {
                var corpID = "corpID";
                var suiteID = "suiteID";
                Repository.getAuthCorpSuiteInfo(corpID, suiteID, function (err, authCorpSuiteInfo) {
                    authCorpSuiteInfo.corpID.should.be.eql("corpID");
                    done();
                });
            });
        });
    });
    describe('#removeAuthCorpSuiteInfo(corpID, suiteID, cb)', function () {
        context('remove a auth corp suite info for corp id and suite id', function () {
            it('is success', function (done) {
                var corpID = "corpID";
                var suiteID = "suiteID";
                Repository.removeAuthCorpSuiteInfo(corpID, suiteID, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    after(function (done) {
        MongoClient.connect("mongodb://localhost:27017/TestWeChat", function (err, db) {
            if (err) {
                return;
            }
            db.collection('authCorpSuiteInfo').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
})
;