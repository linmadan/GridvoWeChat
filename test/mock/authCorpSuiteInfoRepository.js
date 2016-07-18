'use strict';
var AuthCorpSuiteInfo = require('../../lib/domain/authCorpSuiteInfo');

function Repository() {
};

Repository.prototype.saveAuthCorpSuiteInfo = function (authCorpSuiteInfo, callback) {
    callback(null, true);
};

Repository.prototype.removeAuthCorpSuiteInfo = function (corpID, suiteID, callback) {
    callback(null, true);
};

Repository.prototype.getAuthCorpSuiteInfo = function (corpID, suiteID, callback) {
    switch (corpID) {
        case "corpID":
            callback(null, new AuthCorpSuiteInfo({
                corpID: "corpID",
                suiteID: "suiteID",
                permanentCode: "permanentCode",
                accessToken: "accessToken",
                expire: new Date(),
                agents: {}
            }));
            break;
        case "noCorpID":
            callback(null, null);
            break;
        default:
            callback(null, null);
            return;
    }
}
;

module.exports = Repository;