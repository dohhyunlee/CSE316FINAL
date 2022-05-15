#! /usr/bin/env node


var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var User = require('./models/user')
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var notes = []
var users = []

function userCreate(name,email,color,cb){
    userdetail = {name:name, email:email, colorScheme:color }

    var user = new User(userdetail);

    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Author: ' + user);
        users.push(user)
        cb(null, user)
    }  );
}


function createUsers(cb) {
    async.series([
        function(callback) {
          userCreate('Dohhyun', 'dohhyun.lee@stonybrook.edu', '2', callback);
        },
        ],
        // optional callback
        cb);
}


async.series([
    createUsers,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('NO ERR');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




