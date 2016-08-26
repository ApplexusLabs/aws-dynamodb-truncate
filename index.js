'use strict';

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';  //update for your region

var dynamoDB = new AWS.DynamoDB();

var primaryKeys = [];  //hold the keys for deletion


//  As written, this only accomodates simple tables without Secondary Indexes
//  Not to hard to include it though if you need it...this basically just reads the tables
//  details, deletes it and recreates it.

dynamoDB.describeTable({ TableName: process.argv[2] }, function (err, describeReturn) {
    if (err) {
        console.log(err,err.stack);
    } else {

        //get rid of extraneous stuff not needed for createTable
        delete describeReturn.Table.TableStatus; 
        delete describeReturn.Table.CreationDateTime;
        delete describeReturn.Table.ProvisionedThroughput.LastIncreaseDateTime;
        delete describeReturn.Table.ProvisionedThroughput.NumberOfDecreasesToday;
        delete describeReturn.Table.TableArn;
        delete describeReturn.Table.TableSize;
        delete describeReturn.Table.ItemCount;
        delete describeReturn.Table.TableSizeBytes;

        describeReturn.Table.TableName = 'pletcherTlog2';
        //
        
        dynamoDB.createTable(describeReturn.Table, function (err,data) {
            if (err) { console.log(err,err.stack);}
            else {
                console.log(data);
            }
        })
    }
});
