var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var NoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    pub: {
        type: Boolean,
        default: true
    },
    // authorId/authorName just to show more exploits and logical errors
    authorId: {
        type: ObjectId
    },
    authorName: {
        type: String
    }
});

NoteSchema.statics.findPublicComments = function (author, callback) {
    var query = {pub: true};
    if (author) query.authorName = author;
    Note.find(query)
        .exec(function (err, comments) {
            if (!err) {
                if (!comments) comments = [];
                return callback(comments);
            }
        });
}

NoteSchema.statics.findPrivateComments = function (author, callback) {
    var query = {pub: false, authorName: author};
    Note.find(query)
        .exec(function (err, comments) {
            if (!err) {
                if (!comments) comments = [];
                return callback(comments);
            }
        });
}


var Note = mongoose.model('Note', NoteSchema);
module.exports = Note;

//payload  { "type: { "$gte": "" } }