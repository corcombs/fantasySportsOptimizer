// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// define the schema for our user model
var userSchema = new Schema({

    local           : {
        email       : String,
        password    : String
    },
    profileInfo     :{
        firstName   : String,
        lastName    : String,
        bio         : String,
        birthday    : Date
        
    },
    followInfo      : {
        followers   : [ObjectId],
        following   : [ObjectId]
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

