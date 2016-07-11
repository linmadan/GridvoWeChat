'use strict';
var _ = require('underscore');
var util = require('util');
var EventEmitter = require('events');
var SuiteTicket = require('../../domain/suiteTicket');

function Service() {
    EventEmitter.call(this);
    this.__suiteTicketRepository__ = null;
};

util.inherits(Service, EventEmitter);

Service.prototype.saveSuiteTicket = function (suiteTicketData, callback) {
    if (!suiteTicketData.suiteID || !suiteTicketData.ticket) {
        callback(null, false);
    } else {
        var suiteTicket = new SuiteTicket(suiteTicketData);
        this.__suiteTicketRepository__.saveSuiteTicket(suiteTicket, function (err, isSuccess) {
            if (err) {
                callback(err, false);
                return;
            }
            callback(null, isSuccess);
        });
    }
};
Service.prototype.getSuiteTicket = function (suiteID, callback) {
    if (!suiteID) {
        callback(null, null);
    } else {
        this.__suiteTicketRepository__.getSuiteTicket(suiteID, function (err, suiteTicket) {
            if (err) {
                callback(err, null);
                return;
            }
            var suiteTicketData = {};
            if (suiteTicket) {
                suiteTicketData.suiteID = suiteTicket.suiteID;
                suiteTicketData.ticket = suiteTicket.ticket;
            }
            callback(null, suiteTicketData);
        });
    }
};

module.exports = Service;