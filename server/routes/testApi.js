// This is for testing only

var express = require('express');
var router = express.Router();
var auth = require('../controllers/AuthController.js');
var curuser = auth.curUser;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/curuser', function(req, res, next) {
    res.send(curuser);
})

module.exports = router;
