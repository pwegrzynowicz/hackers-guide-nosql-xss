var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Note = require('../models/note');

/* The flag to enable/disable 'add comment' form - only on the client-side.
 * Just a quick hack to keep the participants from messing-up my demo too early. */
var enableAdd = false;

/* GET to initialize the profile page of a logged-in user. */
router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (errUser, user) {
            if (errUser) return next(errUser);
            else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    var comments = [];
                    var privateComments = [];
                    Note.findPublicComments(req.query.author, function (result) {
                        comments = result;
                        Note.findPrivateComments(user.username, function (privResult) {
                            privateComments = privResult;
                            return res.render('profile', {
                                page: 'Profile',
                                user: user,
                                comments: comments,
                                privateComments: privateComments,
                                author: req.query.author,
                                path: '/users/profile',
                                enableAdd: enableAdd
                            });
                        });
                    });
                }
            }
        });
});

/* POST to add a new comment by a logged-in user. */
router.post('/comment', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (errUser, user) {
            if (errUser) return next(errUser);
            else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    const comment = req.body.comment;
                    const pub = !!req.body.pub;
                    if (comment) {
                        Note.create({
                            content: comment,
                            authorId: user._id,
                            pub: pub,
                            authorName: user.username
                        }, function (errNote, note) {
                            if (errNote) return next(errNote);
                            else return res.redirect('/users/profile');
                        });
                    }
                }
            }
        });
});

/* GET to log out - alwyas deleting a session object. */
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;
