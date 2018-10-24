var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Note = require('../models/note');


module.exports = router;

/* GET landing page. */
router.get('/', function (req, res, next) {
    Note.findPublicComments(req.query.author, function (comments) {
        const author = (req.query.author) ? req.query.author : '';
        res.render('index', {
            page: 'Landing Page',
            comments: comments,
            author: author,
            path: '/'
        });
    })
});


router.get('/login-register', function (req, res, next) {
    res.render('login-register', {page: 'Log In'});
});

/* POST route to login an existing user. */
router.post('/login', function (req, res, next) {
    if (req.body.logusername && req.body.logpassword) {
        User.authenticate(req.body.logusername, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                console.log("Logged in: " + req.session.userId);
                return res.redirect('/users/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

/* POST route to register a new user. */
router.post('/register', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("Passwords do not match.");
        return;
    }
    if (req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        var userData = {
            username: req.body.username,
            email: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/users/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})
