const jwt = require('jsonwebtoken');
const _ = require('lodash/fp');

const userController = require('../controllers/user-controller');
const jwtConfig = require('../../config/auth/jwt.config.json');

const trimJWT = jwtToken => jwtToken.replace('JWT ', '');

module.exports = {
  getUserFromJWT(jwtToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(trimJWT(jwtToken), jwtConfig['jwt-secret'], (err, decodedUser) => {
        if (err) return reject(err);
        return resolve(userController.getUserById(decodedUser.id));
      })
    })
  },
};
