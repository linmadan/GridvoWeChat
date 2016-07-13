'use strict';

function AuthCorpSuiteInfo(authCorpSuiteInfoData) {
    this.corpID = authCorpSuiteInfoData.corpID;
    this.suiteID = authCorpSuiteInfoData.suiteID;
    this.permanentCode = authCorpSuiteInfoData.permanentCode;
    this.accessToken = authCorpSuiteInfoData.accessToken;
    this.expire = authCorpSuiteInfoData.expire
};

module.exports = AuthCorpSuiteInfo;