'use strict';
var bearcat = require('bearcat');
var constant = require('./lib/application/util/constant');
var bearcatContextPath = require.resolve('./bcontext.json');
bearcat.createApp([bearcatContextPath]);
var createCallBackURLAuthService;
var createSuiteTicketManageService;
var createSuiteAccessTokenManageService;
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
});
module.exports.createCallBackURLAuthService = createCallBackURLAuthService;
module.exports.createSuiteTicketManageService = createSuiteTicketManageService;
module.exports.createSuiteAccessTokenManageService = createSuiteAccessTokenManageService;
module.exports.constant = constant;