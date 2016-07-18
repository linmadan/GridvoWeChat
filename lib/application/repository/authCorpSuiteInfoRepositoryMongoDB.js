'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var _ = require('underscore');
var AuthCorpSuiteInfo = require('../../domain/authCorpSuiteInfo');

function Repository() {
    this.dBUrl = '';
};

Repository.prototype.saveAuthCorpSuiteInfo = function (authCorpSuiteInfo, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        let updateOperations = {};
        updateOperations.permanentCode = authCorpSuiteInfo.permanentCode;
        updateOperations.accessToken = authCorpSuiteInfo.accessToken;
        updateOperations.expire = authCorpSuiteInfo.expire;
        updateOperations.agents = authCorpSuiteInfo.agents;
        mongoDB.collection("authCorpSuiteInfo").updateOne({
                corpID: authCorpSuiteInfo.corpID,
                suiteID: authCorpSuiteInfo.suiteID
            },
            {
                $set: updateOperations
            },
            {
                upsert: true

            },
            cb);
    }], function (err, result) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (result.result.n == 1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
        mongoDB.close();
    });
};

Repository.prototype.getAuthCorpSuiteInfo = function (corpID, suiteID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        var cursor = db.collection('authCorpSuiteInfo').find({"corpID": corpID, "suiteID": suiteID});
        cursor.limit(1).next(cb);
    }], function (err, document) {
        if (err) {
            callback(err, null);
            mongoDB.close();
            return;
        }
        if (_.isNull(document)) {
            callback(null, null);
            mongoDB.close();
            return;
        }
        var authCorpSuiteInfo = new AuthCorpSuiteInfo(document);
        callback(null, authCorpSuiteInfo);
        mongoDB.close();
    });
};

Repository.prototype.removeAuthCorpSuiteInfo = function (corpID, suiteID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        db.collection('authCorpSuiteInfo').deleteMany({"corpID": corpID, "suiteID": suiteID}, cb);
    }], function (err, result) {
        if (err) {
            callback(err, false);
            mongoDB.close();
            return;
        }
        if (result.result.n == 1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
        mongoDB.close();
    });
};

module.exports = Repository;