'use strict';
var AuthCorp = require('../../lib/domain/authCorp');

function Repository() {
};

Repository.prototype.saveAuthCorp = function (authCorp, callback) {
    callback(null, true);
};

Repository.prototype.getAuthCorp = function (corpID, callback) {
    switch (corpID) {
        case "corpID":
            callback(null, new AuthCorp({
                corpID: "corpID",
                permanentCode: "permanentCode",
                accessToken: "accessToken",
                accessTokenExpire: new Date()
            }));
            break;
        case "noCorpID":
            callback(null, null);
            break;
        default:
            callback(null, null);
            return;
    }
};

module.exports = Repository;