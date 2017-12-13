// shotchart.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// define the schema for our user model
var shotchartSchema = new Schema({
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
    playerID        : Number,
    totalSeconds    : Number,
    fbpts           : Number,
    fbptsa          : Number,
    fbptsm          : Number,
    pip             : Number,
    pipm            : Number,
    num             : Number,
    pos             : String,
    tf              : Number,
    blka            : Number,
    status          : String,
    memo            : String

});
shotchartSchema.index({ playerFName: 1,playerLName: 1, dateOfGame: 1}, { unique: true });
// methods ======================
// generating a hash


// create the model for users and expose it to our app
module.exports = mongoose.model('shotChart', shotchartSchema);

