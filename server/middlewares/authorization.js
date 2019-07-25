let jwt = require('jsonwebtoken');
const config = require('../config');

let isPermitted = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (decoded._id === req.params.userID) {
                next();
            } else {
                return res.json({
                    success: false,
                    message: 'Not permitted!'
                  });
            }
        })
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
          });
    }
}

let isAdmin = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (decoded.role == 'admin') {
                next();
            } else {
                return res.status(403).json('Only administrators can do this action');
            }
        })
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
          });
    }
}

module.exports = {
    isPermitted: isPermitted,
    isAdmin: isAdmin
  }