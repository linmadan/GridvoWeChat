'use strict';

function SuiteTicket(suiteTicketData) {
    this.suiteID = suiteTicketData.suiteID;
    this.ticket = suiteTicketData.ticket;
};

module.exports = SuiteTicket;