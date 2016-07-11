'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var _ = require('underscore');
var AuthCorp = require('../../domain/authCorp');

function Repository() {
    this.dBUrl = '';
};

Repository.prototype.saveAuthCorp = function (authCorp, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        let updateOperations = {};
        updateOperations.permanentCode = authCorp.permanentCode;
        updateOperations.accessToken = authCorp.accessToken;
        updateOperations.accessTokenExpire = authCorp.accessTokenExpire;
        mongoDB.collection("authCorp").updateOne({
                corpID: authCorp.corpID
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

Repository.prototype.getAuthCorp = function (corpID, callback) {
    var repository = this;
    var mongoDB;
    async.waterfall([function (cb) {
        MongoClient.connect(repository.dBUrl, cb);
    }, function (db, cb) {
        mongoDB = db;
        var cursor = db.collection('authCorp').find({"corpID": corpID});
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
        var authCorp = new AuthCorp(document);
        callback(null, authCorp);
        mongoDB.close();
    });
};

module.exports = Repository;