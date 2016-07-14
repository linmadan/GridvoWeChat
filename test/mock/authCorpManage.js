'use strict';

function Service() {
};

Service.prototype.getAuthCorpSuitePermanentCode = function (authCorpID, suiteID, callback) {
    callback(null, "authCorpSuitePermanentCode");
};

Service.prototype.getAuthCorpSuiteAccessToken = function (authCorpID, suiteID, callback) {
    callback(null, "authCorpSuiteAccessToken");
};

Service.prototype.updateAuthCorpSuiteAccessToken = function (authCorpID, suiteID, data, callback) {
    callback(null, true);
};

module.exports = Service;