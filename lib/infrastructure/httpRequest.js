'use strict';
var request = require('request');

function Requester(accessToken, agentID) {
    this.accessToken = accessToken;
    this.agentID = agentID;
};

Requester.prototype.callQYDevAPI = function (url) {

}

module.exports = Requester;
