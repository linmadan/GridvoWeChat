'use strict';

function Service() {
};

Service.prototype.getLatestSuiteAccessToken = function (suiteID, callback) {
    callback(null, "suiteAccessToken");
};

module.exports = Service;