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
    describe('#createApp(appName, callback)', function () {
        context('create a app for auth corp suite', function () {
            it('is fail if request wechat server fail or other depend err', function (done) {
                var mockRequest = function (options, callback) {
                    var err = true;
                    callback(err, null);
                };
                muk(service, "__httpRequest__", mockRequest);
                var appName = "waterStationApp";
                service.createApp(appName, function (err, isSuccess) {
                    isSuccess.should.be.eql(false);
                    done();
                });
            });
            it('is success if all is ok', function (done) {
                var mockRequest = function (options, callback) {
                    if (options.body.button) {
                        callback(null, {}, {
                            "errcode": 0,
                            "errmsg": "ok"
                        });
                    }
                    else{
                        callback(null, {}, {
                            "access_token": "accessToken"
                        });
                    }
                };
                muk(service, "__httpRequest__", mockRequest);
                var appName = "waterStationApp";
                service.createApp(appName, function (err, isSuccess) {
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