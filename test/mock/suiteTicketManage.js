'use strict';

function Service() {
};

Service.prototype.saveSuiteTicket = function (suiteTicketData, callback) {
    callback(null, true);
};
Service.prototype.getSuiteTicket = function (suiteID, callback) {
    var suiteTicketData = {};
    suiteTicketData.suiteID = "suiteID";
    suiteTicketData.ticket = "ticket";
    callback(null, suiteTicketData);
};

module.exports = Service;