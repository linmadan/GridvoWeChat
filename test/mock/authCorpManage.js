'use strict';

function Service() {
};

Service.prototype.getAuthCorpLatesSuiteAccessToken = function (authCorpID, suiteID, callback) {
    callback(null, "authCorpSuiteAccessToken");
};

module.exports = Service;