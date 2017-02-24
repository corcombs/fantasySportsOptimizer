// players.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// define the schema for our user model
var playersSchema = new Schema({
    playerFName      : String,
    playerLName      : String,
    dateOfGame      : Date,
    teamAbbreviation    : String,
    teamID          : Number,
    opponentAbbreviation :String,
    opponentID    : Number,
    minutesPlayed   : Number,
    secondsPlayed   : Number,
    fieldGoals      : Number,
    fieldGoalsAttempted : Number,
    threeFieldGoal  : Number,
    threeFieldGoalAttempted : Number,
    freeThrow       : Number,
    freeThrowAttempted  : Number,
    offensiveRebounds   : Number,
    defensiveRebounds   : Number,
    assists         : Number,
    steals          : Number,
    blocks          : Number,
    turnovers       : Number,
    fouls           : Number,
    plusMinus       : Number,
    playerID        : Number

});
playersSchema.index({ playerFName: 1,playerLName: 1, dateOfGame: 1}, { unique: true });
// methods ======================
// generating a hash


// create the model for users and expose it to our app
module.exports = mongoose.model('Players', playersSchema);

