'use strict';
var bearcat = require('bearcat');
var constant = require('./lib/application/util/constant');
var weChatCorpServiceAPI = require('./lib/application/util/weChatCorpServiceAPI');
var bearcatContextPath = require.resolve('./bcontext.json');
bearcat.createApp([bearcatContextPath]);
var createCallBackURLAuthService;
var createSuiteTicketManageService;
var createSuiteAccessTokenManageService;
var createAuthCorpManageService;
var createAuthCorpSuiteProxyService;
var createCorpAuthSuiteService;
bearcat.start(function () {
    createCallBackURLAuthService = function () {
        return bearcat.getBean('callBackURLAuthService');
    };
    createSuiteTicketManageService = function () {
        return bearcat.getBean('suiteTicketManageService');
    };
    createSuiteAccessTokenManageService = function () {
        return bearcat.getBean('suiteAccessTokenManageService');
    };
    createAuthCorpManageService = function () {
        return bearcat.getBean('authCorpManageService');
    };
    createAuthCorpSuiteProxyService = function () {
        return bearcat.getBean('authCorpSuiteProxyService');
    };
    createCorpAuthSuiteService = function () {
        return bearcat.getBean('corpAuthSuiteService');
    };
});
module.exports.createCallBackURLAuthService = createCallBackURLAuthService;
module.exports.createSuiteTicketManageService = createSuiteTicketManageService;
module.exports.createSuiteAccessTokenManageService = createSuiteAccessTokenManageService;
module.exports.createAuthCorpManageService = createAuthCorpManageService;
module.exports.createAuthCorpSuiteProxyService = createAuthCorpSuiteProxyService;
module.exports.createCorpAuthSuiteService = createCorpAuthSuiteService;
module.exports.constant = constant;