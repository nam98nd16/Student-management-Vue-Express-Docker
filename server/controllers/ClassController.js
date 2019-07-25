var mongoose = require('mongoose');
var Class = require('../models/Class');
var User = require('../models/User');

var classController = {};

classController.addClass = async function (req, res){
    var existed = await Class.findOne({ name: req.body.name});
    if (!req.body.name){
        return res.status(403).json('Literally unable to create an unnamed class');
    }else if (existed) {
        return res.status(403).json('A class with the given name already exists');
    } else {
        var cla = await new Class(req.body);
        cla.save();
        return res.json('Successfully created new class!');
    }
}

classController.getAllClasses = function (req, res){
    Class.find((err, classes) => {
        if (err || classes.length == 0) {
            return res.json('Literally no classes found');
        } else {
            return res.json(classes);
        }
    })
}

classController.deleteClass = async function (req, res){
    if (!req.body.name) {
        return res.status(400).json('Literally unable to delete an unnamed class');
    }
    var existed = await Class.findOne({ name: req.body.name});
    Class.deleteOne({ name: req.body.name }, err => {
        if (!existed) {
            return res.status(400).json('There are literally no classes named ' + req.body.name);
        }
        if (err) {
            return res.status(400).json(err);
        }
        return res.json('Successfully deleted class ' + req.body.name);
    })
}

classController.addStudentToAClass = async function (req, res){
    if (!mongoose.Types.ObjectId.isValid(req.body.classID)) {
        return res.status(400).json('There are literally no classes with id ' + req.body.classID);
    }

    User.findOne({ _id: req.body.userID})
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json('There are literally no users with id ' + req.body.userID);
            } else {
                var currentClass = user.class;
                if (currentClass) {
                    return res.status(400).json('The user is already in a class' );
                } else {
                    User.findByIdAndUpdate(req.body.userID, {class: req.body.classID}, {new: true}).select('_id username class').populate('class', '_id name')
                                            .exec((err, result) => {
                                                if (err) {
                                                    return res.status(400).json(err);
                                                }
                                                res.json('Successfully added');
                                            });
                    Class.findByIdAndUpdate(req.body.classID, {$push: { students: req.body.userID}, updated: Date.now()}, {new: true}).select('_id name students').populate('students', '_id username')
                                            .exec((err, result) => {
                                                if (err) {
                                                    return res.status(400).json(err);
                                                }
                                                //res.send(result);
                                            })
                }
            }
        })
}

classController.removeStudentFromAClass = function (req, res){
    let ifError = false
    if (!mongoose.Types.ObjectId.isValid(req.body.classID)) {
        return res.status(400).json('There are literally no classes with id ' + req.body.classID);
    }

    Class.findOne({students: req.body.userID}, (err, cla) => {
        if (!cla) {
            ifError = false
        }else if (cla._id != req.body.classID) {
            ifError = true
        }
    })

    User.findOne({ _id: req.body.userID})
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json('There are literally no users with id ' + req.body.userID);
            } else {
                var currentClass = user.class;
                if (ifError) {
                    return res.status(400).json('The student you are trying to remove is in another class')
                }
                if (!currentClass) {
                    return res.status(400).json('This user is already not in any classes!' );
                } else {
                    User.findByIdAndUpdate(req.body.userID, {class: null}, {new: true}).select('_id username class').populate('class', '_id name')
                                            .exec((err, result) => {
                                                if (err) {
                                                    return res.status(400).json(err);
                                                }
                                                return res.json('Successfully removed');
                                            });
                    Class.findByIdAndUpdate(req.body.classID, {$pull: { students: req.body.userID}, updated: Date.now()}, {new: true}).select('_id name students').populate('students', '_id username')
                                            .exec((err, result) => {
                                                if (err) {
                                                    return res.status(400).json(err);
                                                }
                                                //res.send(result);
                                            })
                }
            }
        })
}

classController.getAllStudentsInAClass = function (req, res){
    if (!mongoose.Types.ObjectId.isValid(req.params.classID)) {
        return res.status(400).json({error: 'There are literally no classes with id ' + req.params.classID});
    }
    Class.findById(req.params.classID, 'students', function (err, student) {
        if (err) {
            return res.json(err);
        }else {
            return res.json(student);
        }
    })
}

module.exports = classController