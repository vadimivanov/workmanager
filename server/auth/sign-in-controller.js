const EventEmitter = require('events');
const _ = require('lodash/fp');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const log = require('../utils/logger/logger')(module);

const userController = require('../controllers/user-controller');
const jwtConfig = require('../../config/auth/jwt.config.json');

class SignInController extends EventEmitter {
  constructor() {
    super();

    this._checkUserPassword = ({ password_hash }, candidatePassword) => (!_.isEmpty(password_hash) && !_.isEmpty(candidatePassword)) ? bcrypt.compareSync(candidatePassword, password_hash) : false;

    this._encodeUserToJWT = ({ id }) => jwt.encode({ id }, jwtConfig['jwt-secret']);

    this.checkIsUserBlocked = credentials => userController
      .getUserByPK(credentials)
      .then(user => !user.is_verified
        ? { success: false, msg: 'Not verified email!' }
        : !user.is_enabled
          ? { success: false, msg: 'Blocked user!' }
          : null
      );

    this.getToken = credentials => userController
      .getUserByPK(credentials)
        .then(user => !_.isEmpty(user) && this._checkUserPassword(user, credentials.password)
          ? { JWT: `JWT ${this._encodeUserToJWT(user)}`, user }
          : null
        );

    this.appendingTokenToUser = user => new Promise((resolve, reject) => {
      if (!_.isEmpty(user)) return resolve(Object.assign({}, user.dataValues, { JWT: `JWT ${this._encodeUserToJWT(user)}` }));
      return reject(new Error('User hasn\'t been created.'));
    })
  }
}

module.exports = new SignInController();
