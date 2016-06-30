'use strict';
var bearcat = require('bearcat');
var should = require('should');

describe('suiteTicketManage service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('suiteTicketManageService');
        });
    });
    context('save a suite ticket #saveSuiteTicket(suiteTicketData,callback)', function () {
        it('save suite ticket fail if no suiteID or ticket', function (done) {
            var suiteTicketData = {};
            suiteTicketData.suiteID = "";
            service.saveSuiteTicket(suiteTicketData, function (err, isSuccess) {
                isSuccess.should.be.eql(false);
                done();
            });
        });
        it('save suite ticket success', function (done) {
            var suiteTicketData = {};
            suiteTicketData.suiteID = "suiteID";
            suiteTicketData.ticket = "Ticket";
            service.saveSuiteTicket(suiteTicketData, function (err, isSuccess) {
                isSuccess.should.be.eql(true);
                done();
            });
        });
    });
    context('get suite ticket #getSuiteTicket(suiteID,callback)', function () {
        it('get suite ticket for suite id', function (done) {
            var suiteID = "suiteID";
            service.getSuiteTicket(suiteID, function (err, suiteTicketData) {
                suiteTicketData.suiteID.should.be.eql("suiteID");
                suiteTicketData.ticket.should.be.eql("Ticket");
                done();
            });
        });
    });
});