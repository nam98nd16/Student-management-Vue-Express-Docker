var User = require('../models/User');
var Class = require('../models/Class');
const _ = require('lodash');

var profileController = {};

profileController.searchUser = function (req, res) {
    User.findById(req.params.userID)
        .select('_id username description role class')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json('Unable to find user with the input id')
            }else {
                return res.json(user);
            }
        })
}

profileController.deleteUser = function (req, res) {
    var inAClass
    var classID
    Class.findOne({students: req.params.userID}, (err, cla) => {
        if (!cla) {
            inAClass = false
        }else {
            inAClass = true
            classID = cla._id

        }
    })
    User.findOne({_id: req.params.userID}, (err, user) => {
        if (!user) {
            return res.status(400).json('Unable to find user with the input id')
        }else if (user.role == 'admin') {
            return res.status(400).json('Unable to delete an admin account')
        } else if (err) {
            return res.status(400).json(err)
        } else {
            if (inAClass) {
                Class.findByIdAndUpdate(classID, {$pull: { students: req.params.userID}, updated: Date.now()}, {new: true}).select('_id name students').populate('students', '_id username')
                .exec((err, result) => {
                    if (err) {
                        return res.status(400).json(err);
                    }
                    //res.send(result);
                    //console.log('true')
                })
            }
            User.findByIdAndDelete(req.params.userID, (err, user) => {
                if (err || !user) {
                    return res.status(400).json('Error deleting user');
                } else {
                    return res.json('Successfully deleted');
                }
            })

        }
    })
}

profileController.getAllUser = function (req, res) {
    User.find((err, users) => {
        if (err || users.length == 0) {
            return res.send('Literally no users found');
        } else {
            return res.json(users);
        }
    })
}

profileController.updateUser = function (req, res) {
    if (req.body.password) {
        return res.json("Currently unable to change password! Try again later")
    }
    User.findById(req.params.userID)
        .select('_id username role class')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({error: 'There are no users with id ' + req.params.userID});
            }else {
                user = _.assignIn(user, req.body);
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({ error: err });
                    }
                    return res.json(user);
                })
            }
        })
}

module.exports = profileController