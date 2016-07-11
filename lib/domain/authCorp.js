'use strict';

function AuthCorp(authCorpData) {
    this.corpID = authCorpData.corpID;
    this.permanentCode = authCorpData.permanentCode;
    this.accessToken = authCorpData.accessToken;
    this.accessTokenExpire = authCorpData.accessTokenExpire
};

module.exports = AuthCorp;