'use strict';
var MongoClient = require('mongodb').MongoClient;
var bearcat = require('bearcat');
var _ = require('underscore');
var should = require('should');
var SuiteAccessToken = require('../../lib/domain/suiteAccessToken');

describe('suite access token repository MongoDB use case test', function () {
    var Repository;
    before(function () {
        var contextPath = require.resolve('../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            Repository = bearcat.getBean('suiteAccessTokenRepository');
        });
    });
    describe('#saveSuiteAccessToken(suiteAccessToken, cb)', function () {
        context('save a suite access token', function () {
            it('should return true if save success', function (done) {
                var suiteAccessToken = new SuiteAccessToken({
                    suiteID: "suiteAccessTokenID",
                    accessToken: "AccessToken",
                    expire: new Date()
                });
                Repository.saveSuiteAccessToken(suiteAccessToken, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getSuiteAccessToken(suiteAccessTokenID, cb)', function () {
        context('get a suite access token for id', function () {
            it('should return null if no this suite access token', function (done) {
                var suiteAccessTokenID = "noSuiteID";
                Repository.getSuiteAccessToken(suiteAccessTokenID, function (err, suiteAccessToken) {
                    _.isNull(suiteAccessToken).should.be.eql(true);
                    done();
                });
            });
            it('should return account', function (done) {
                var suiteAccessTokenID = "suiteAccessTokenID";
                Repository.getSuiteAccessToken(suiteAccessTokenID, function (err, suiteAccessToken) {
                    suiteAccessToken.suiteID.should.be.eql("suiteAccessTokenID");
                    suiteAccessToken.accessToken.should.be.eql("AccessToken");
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
            db.collection('suiteAccessToken').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
})
;