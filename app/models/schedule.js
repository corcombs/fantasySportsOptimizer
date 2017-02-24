// players.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// define the schema for our user model
var scheduleSchema = new Schema({
    dateOfGame      : Date,
    teamID        : Number,
    teamAbbreviation : String,
    opponentID    : Number,
    opponentAbbreviation : String,
    gameID       : Number

});



// create the model for users and expose it to our app
module.exports = mongoose.model('Schedule', scheduleSchema);

