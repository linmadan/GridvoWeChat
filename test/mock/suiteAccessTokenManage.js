'use strict';

function Service() {
};

Service.prototype.getLatestSuiteAccessToken = function (suiteName, callback) {
    callback(null, "suiteAccessToken");
};

module.exports = Service;