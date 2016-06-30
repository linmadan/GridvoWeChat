'use strict';
var MongoClient = require('mongodb').MongoClient;
var bearcat = require('bearcat');
var _ = require('underscore');
var should = require('should');
var SuiteTicket = require('../../lib/domain/suiteTicket');

describe('suite ticket repository MongoDB use case test', function () {
    var Repository;
    before(function () {
        var contextPath = require.resolve('../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            Repository = bearcat.getBean('suiteTicketRepository');
        });
    });
    describe('#saveSuiteTicket(suiteTicket, cb)', function () {
        context('save a suite ticket', function () {
            it('should return true if save success', function (done) {
                var suiteTicket = new SuiteTicket({
                    suiteID: "suiteID",
                    ticket: "Ticket"
                });
                Repository.saveSuiteTicket(suiteTicket, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getSuiteTicket(suiteID, cb)', function () {
        context('get a suite ticket for id', function () {
            it('should return null if no this suite ticket', function (done) {
                var suiteID = "noSuiteID";
                Repository.getSuiteTicket(suiteID, function (err, suiteTicket) {
                    _.isNull(suiteTicket).should.be.eql(true);
                    done();
                });
            });
            it('should return account', function (done) {
                var suiteID = "suiteID";
                Repository.getSuiteTicket(suiteID, function (err, suiteTicket) {
                    suiteTicket.suiteID.should.be.eql("suiteID");
                    suiteTicket.ticket.should.be.eql("Ticket");
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
            db.collection('suiteTicket').drop(function (err, response) {
                db.close();
                done();
            });
        });
    });
});