'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');
var muk = require('muk');

describe('authCorpSuiteProxy service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('authCorpSuiteProxyService');
        });
    });
    describe('#createSuiteApp(authCorpID, suiteID, appID, appContent, callback)', function () {
        context('create a app for auth corp suite', function () {
            it('is fail if request wechat server fail or other depend err', function (done) {
                var mockRequest = function (options, callback) {
                    var err = true;
                    callback(err, null);
                };
                muk(service, "__httpRequest__", mockRequest);
                var authCorpID = "authCorpID";
                var suiteID = "suiteID";
                var appID = "appID";
                var appContent = {};
                service.createSuiteApp(authCorpID, suiteID, appID, appContent, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('is success if all is ok', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, {
                        "errcode": 0,
                        "errmsg": "ok"
                    });
                };
                muk(service, "__httpRequest__", mockRequest);
                var authCorpID = "authCorpID";
                var suiteID = "suiteID";
                var appID = "appID";
                var appContent = {};
                service.createSuiteApp(authCorpID, suiteID, appID, appContent, function (err, isSuccess) {
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
            after(function () {
                muk.restore();
            });
        });
    });
});