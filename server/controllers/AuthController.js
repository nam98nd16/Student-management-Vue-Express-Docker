var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/User');
let jwt = require('jsonwebtoken');
let config = require('../config');
var curUser;

var userController = {};

userController.home = function(req, res){
    res.render('index', {user: req.user});
};

userController.register = function(req, res){
    res.render('register');
};

userController.doRegister = function(req, res){
    User.register(new User({
        username: req.body.username,
        name: req.body.name
    }), req.body.password, function(err, user){
        if (err) {
            return res.status(403).json({error: 'Either the username/password is not provided or the username is already used'});
        }

        passport.authenticate('local')(req, res, function () {
            return res.json({message: "Successfully signed up"});
        });
    });
};

userController.login = function(req, res) {
    res.render('login');
};

userController.doLogin = function(req, res) {
    passport.authenticate('local') (req, res, function() {
        // curUser = req.user; // just for client test
        // var extractedUser;

        User.findOne({ username: req.body.username }, (err, user) => {
            if (err || !user) {
                // Impossible to get to this
            }
            let token = jwt.sign({ _id: user._id, role: user.role}, config.secret, { expiresIn: '12000s'});
            res.json({
                success: true,
                message: 'Authentication successful',
                token: token,
                user: user
            });
        })
    });
};

userController.logout = function(req, res) {
    req.logout();
    res.send('Successfully logged out!');
}
exports.curUser = curUser;
module.exports = userController;