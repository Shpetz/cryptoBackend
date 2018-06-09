// Set up
const express    = require('express');
const app        = express();
const mongoose   = require('mongoose');
const logger     = require('morgan');
const bodyParser = require('body-parser');
const cors       = require('cors');
const env        = require('dotenv').load(); //this is for loading the db secrets from file
const request    = require('request');
var StellarSdk = require('stellar-sdk');

//ACCOUNT 1
// Public Key: GDGUPWYM54FUJVJCKMYFG6UAOXF67MJYP6VRIZ7I6W5ULP5UAKR42EJM
// Secret Key: SDNJJY22TIC3JMDKM4PGBLREPYGKUTSAYSDKVQTGXHLS2S7YKV2XCGID

// ACCOUNT 2
// Public Key: GCOEBLZKBAMGFQ6BIMWPP2U6W4CWX6UV2YEJC5VTVDT24KP3LRORIRRN
// Secret Key: SC2UH4NEZNEI2EZ5MML5VGC2GCZQWC2HDDKADQCSS7JMGF2XUAKL26YA

// ACCOUNT 3
// Public Key: SDQNXAYSC3BE2EA6KO4CZA2V4MS5SE76GJ2DJ3AAPX524VPWB53BXTLI
// Secret Key: GB3NRJBDQBFHE7T2A6UE4BYSEJKM75UTZLQG6PFM2EYAHNNVVI6LIR2P

// ACCOUNT 3
// Public Key: SDQNXAYSC3BE2EA6KO4CZA2V4MS5SE76GJ2DJ3AAPX524VPWB53BXTLI
// Secret Key: GB3NRJBDQBFHE7T2A6UE4BYSEJKM75UTZLQG6PFM2EYAHNNVVI6LIR2P

// ACCOUNT 4
// Public Key: SDJMVJCLRF34YNA7SXWELBU5HME5WJRY7KFUHDO3PL2S3VROYOZWMH5Y
// Secret Key: GDKUGZERL3IT5SQY3OHNG7JOOW7PVCLZ3LR2IUX7BZSJWXRITRYX5ALP


//create new public/private key come - required for stellar wallet
var pair = StellarSdk.Keypair.random();
pair.secret();
console.log("secret: " + pair.secret())
pair.publicKey();
console.log("publicKey: " + pair.publicKey())

//use the public key to create a new test account with some currency
console.log("sending request to friendbot")
request.get({
  url: 'https://friendbot.stellar.org',
  qs: { addr: pair.publicKey() },
  json: true
}, function(error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('ERROR!', error || body);
  }
  else {
    console.log('SUCCESS! You have a new account :)\n', body._links.transaction.href);
    loadaccounts();
  }
});

function loadaccounts(){
  var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
  //query the server for the accout balance
  server.loadAccount(pair.publicKey()).then(function(account) {
    console.log('Balances for account: ' + pair.publicKey());
    account.balances.forEach(function(balance) {
      console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
    });
  }, function (error) {
      console.log(error);
  });
  
  //
}

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
// console.log("Connected to DB");
// });
 
// app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
// app.use(bodyParser.json()); // Send JSON responses
// app.use(logger('dev')); // Log requests to API using morgan
// app.use(cors());
 
// Models
// var Room = mongoose.model('Room', {
//     room_number: Number,
//     type: String,
//     beds: Number,
//     max_occupancy: Number,
//     cost_per_night: Number,
//     reserved: [
//         {
//             from: String,
//             to: String
//         }
//     ]
// });

// /*
//  * Generate some test data, if no records exist already
//  * MAKE SURE TO REMOVE THIS IN PROD ENVIRONMENT
// */

// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// Room.remove({}, function(res){
//     console.log("removed records");
// });

// Room.count({}, function(err, count){
//     console.log("Rooms: " + count);

//     if(count === 0){

//         var recordsToGenerate = 150;

//         var roomTypes = [
//             'standard',
//             'villa',
//             'penthouse',
//             'studio'
//         ];

//         // For testing purposes, all rooms will be booked out from:
//         // 18th May 2017 to 25th May 2017, and
//         // 29th Jan 2018 to 31 Jan 2018

//         for(var i = 0; i < recordsToGenerate; i++){
//             var newRoom = new Room({
//                 room_number: i,
//                 type: roomTypes[getRandomInt(0,3)],
//                 beds: getRandomInt(1, 6),
//                 max_occupancy: getRandomInt(1, 8),
//                 cost_per_night: getRandomInt(50, 500),
//                 reserved: [
//                     {from: '1970-01-01', to: '1970-01-02'},
//                     {from: '2017-04-18', to: '2017-04-23'},
//                     {from: '2018-01-29', to: '2018-01-30'}
//                 ]
//             });

//             newRoom.save(function(err, doc){
//                 console.log("Created test document: " + doc._id);
//             });
//         } 
        
//     }
// });
 
// Routes

    // app.post('/api/rooms', function(req, res) {

    //     Room.find({
    //         type: req.body.roomType,
    //         beds: req.body.beds,
    //         max_occupancy: {$gt: req.body.guests},
    //         cost_per_night: {$gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper},
    //         reserved: { 

    //             //Check if any of the dates the room has been reserved for overlap with the requsted dates
    //             $not: {
    //                 $elemMatch: {from: {$lt: req.body.to.substring(0,10)}, to: {$gt: req.body.from.substring(0,10)}}
    //             }

    //         }
    //     }, function(err, rooms){
    //         if(err){
    //             res.send(err);
    //         } else {
    //             res.json(rooms);
    //         }
    //     });

    // });
 
    // app.post('/api/rooms/reserve', function(req, res) {
 
    //     console.log(req.body._id);

    //     Room.findByIdAndUpdate(req.body._id, {
    //         $push: {"reserved": {from: req.body.from, to: req.body.to}}
    //     }, {
    //         safe: true,
    //         new: true
    //     }, function(err, room){
    //         if(err){
    //             res.send(err);
    //         } else {
    //             res.json(room);
    //         }
    //     });
 
    // });
 
// listen
app.listen(8080);
// console.log("App listening on port 8080");