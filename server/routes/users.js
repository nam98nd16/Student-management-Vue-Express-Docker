var express = require('express');
var router = express.Router();
const passport = require('passport');
var profile = require('../controllers/ProfileController.js');
var {isLoggedIn} = require('../middlewares/authentication');
var {isPermitted} = require('../middlewares/authorization');
var {isAdmin} = require('../middlewares/authorization');
/* GET users listing. */
router.get('/', isLoggedIn, profile.getAllUser)
router.put('/:userID', isLoggedIn, isPermitted, profile.updateUser)
router.get('/:userID', isLoggedIn, profile.searchUser)
router.delete('/:userID', isLoggedIn, isAdmin, profile.deleteUser)

module.exports = router;
