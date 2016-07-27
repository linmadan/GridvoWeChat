'use strict';
var _ = require('underscore');
var bearcat = require('bearcat');
var should = require('should');
var muk = require('muk');

describe('corpUserManage service use case test', function () {
    var service;
    before(function () {
        var contextPath = require.resolve('../../../testbcontext.json');
        bearcat.createApp([contextPath]);
        bearcat.start(function () {
            service = bearcat.getBean('corpUserManageService');
        });
    });
    describe('#getUserIDByCode(accessToken, code, callback)', function () {
        context('get corp user id', function () {
            it('return null if wechat server no return  UserId or OpenId', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, {no: "no"});
                };
                muk(service, "__httpRequest__", mockRequest);
                var accessToken = "accessToken";
                var code = "code";
                service.getUserIDByCode(accessToken, code, function (err, userID) {
                    _.isNull(userID).should.be.eql(true);
                    done();
                });
            });
            it('is success if all is ok ', function (done) {
                var mockRequest = function (options, callback) {
                    callback(null, {}, {UserId: "userID"});
                };
                muk(service, "__httpRequest__", mockRequest);
                var accessToken = "accessToken";
                var code = "code";
                service.getUserIDByCode(accessToken, code, function (err, userID) {
                    userID.should.be.eql("userID");
                    done();
                });
            });
            after(function () {
                muk.restore();
            });
        });
    });
});