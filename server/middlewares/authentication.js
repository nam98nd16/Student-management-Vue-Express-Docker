let jwt = require('jsonwebtoken');
const config = require('../config');

let isLoggedIn = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Not logged in!'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  };

  module.exports = {
    isLoggedIn: isLoggedIn
  }
