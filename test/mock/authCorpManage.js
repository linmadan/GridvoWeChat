'use strict';

function Service() {
};

Service.prototype.getAuthCorpLatesSuiteAccessToken = function (authCorpID, suiteID, callback) {
    callback(null, "authCorpSuiteAccessToken");
};

Service.prototype.getAuthCorpSuiteAgentInfo = function (authCorpID, suiteID, appID, callback) {
    callback(null, {"1": {agentid: "1"}});
};

module.exports = Service;