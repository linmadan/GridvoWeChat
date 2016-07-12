'use strict';
var MongoClient = require('mongodb').MongoClient;
var bearcat = require('bearcat');
var _ = require('underscore');
var should = require('should');
var AuthCorp = require('../../../lib/domain/authCorp');

describe('auth corp repository MongoDB use case test', function () {
    var Repository;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            Repository = bearcat.getBean('authCorpRepository');
        });
    });
    describe('#saveAuthCorp(authCorp, cb)', function () {
        context('save a auth corp', function () {
            it('should return true if save success', function (done) {
                var authCorp = new AuthCorp({
                    corpID: "corpID",
                    permanentCode: "permanentCode",
                    accessToken: "accessToken",
                    accessTokenExpire: new Date()
                });
                Repository.saveAuthCorp(authCorp, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getAuthCorp(corpID, cb)', function () {
        context('get a auth corp for id', function () {
            it('should return null if no this auth corp', function (done) {
                var corpID = "noCorpID";
                Repository.getAuthCorp(corpID, function (err, authCorp) {
                    _.isNull(authCorp).should.be.eql(true);
                    done();
                });
            });
            it('should return auth corp', function (done) {
                var corpID = "corpID";
                Repository.getAuthCorp(corpID, function (err, authCorp) {
                    authCorp.corpID.should.be.eql("corpID");
                    authCorp.permanentCode.should.be.eql("permanentCode");
                    authCorp.accessToken.should.be.eql("accessToken");
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
            db.collection('authCorp').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
})
;