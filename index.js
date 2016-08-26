'use strict';

var AWS = require('aws-sdk');
var async = require('async');

AWS.config.region = 'us-east-1';  //update for your region

var dynamoDb = new AWS.DynamoDB();

//  As written, this only accomodates simple tables without Secondary Indexes
//  Not to hard to include it though if you need it...this basically just reads the tables
//  details, deletes it and recreates it.

// Might want to crank up your provisioning for Writes to make this go faster

function deleteBatch(tableName, next) {

    var primaryKeys = [];
    var itemsToDelete = [];

    async.series([
        function (callback) {
            dynamoDb.describeTable({
                TableName: process.argv[2]
            }, function (err, returnDescribe) {
                if (err) {
                    return callback(err);
                } else {
                    //extract primary keys for the fetch and deletes
                    returnDescribe.Table.KeySchema.forEach(function(element){
                        primaryKeys.push(element.AttributeName);
                    });
                    callback();
                }
            });
        },
        function (callback) {
            //we use scan here rather than query just for simplicity.  query 
            //would probably be faster, but then we'd have to parse our multiple keys and format
            //the KeyConditions segment

            dynamoDb.scan({
                TableName: tableName,
                AttributesToGet: primaryKeys
            }, function (err, returnQuery) {
                if (err) {
                    return callback(err);
                }
                if (returnQuery.Items.length === 0) {
                    return next('No Items Found');
                }
                itemsToDelete = returnQuery.Items;
                callback();
            });
        },
        function (callback) {
            console.log('Starting to delete', itemsToDelete.length, 'records');
            itemsToDelete.forEach(function (element, i) {
                if (i % 1000 === 0) {
                    console.log('...at', i, 'records');
                }
                dynamoDb.deleteItem({
                    TableName: tableName,
                    Key: element
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }
                });
            })
            callback();
        }
    ], function (err) {
        if (err) { return next(err); }
    });
}

deleteBatch(process.argv[2], function next(err) {
    if (err) {
        console.log(err);
    }
    console.log('All done.');
});