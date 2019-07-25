var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../controllers/AuthController.js');
var {isLoggedIn} = require('../middlewares/authentication');

/* GET home page. */
router.get('/test', (req, res) => {
  res.send(
    [{
      title: 'Hello',
      description: 'Testing axios call ...'
    }]
  )
})

router.get('/', auth.home);

router.get('/register', auth.register);

router.post('/register', auth.doRegister);

router.get('/login', auth.login);

router.post('/login', auth.doLogin);

router.get('/logout', isLoggedIn, auth.logout);

module.exports = router;
