var express = require('express');
var router = express.Router();
var classes = require('../controllers/ClassController.js');
var {isLoggedIn} = require('../middlewares/authentication');
var {isAdmin} = require('../middlewares/authorization');

router.post('/', isLoggedIn, isAdmin, classes.addClass)
router.get('/', isLoggedIn, isAdmin, classes.getAllClasses)
router.delete('/', isLoggedIn, isAdmin, classes.deleteClass)
router.post('/students', isLoggedIn, isAdmin, classes.addStudentToAClass)
router.delete('/students', isLoggedIn, isAdmin, classes.removeStudentFromAClass)
router.get('/:classID', isLoggedIn, isAdmin, classes.getAllStudentsInAClass)

module.exports = router;