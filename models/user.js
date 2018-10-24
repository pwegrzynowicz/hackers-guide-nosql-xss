var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    }
});

// authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({username: username, password: password})
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            return callback(null, user);
        });
}

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    next();
});


var User = mongoose.model('User', UserSchema);
module.exports = User;

//payload  { "type: { "$gte": "" } }