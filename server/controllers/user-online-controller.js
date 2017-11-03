const EventEmitter = require('events');
const _ = require('lodash/fp');

const { sequelize } = require('../models');
const userService = require('../services/user.service');

class UserOnlineController extends EventEmitter {
  constructor() {
    super();

    this.setUserLastOnlineNowMiddleware = (req, res, next) => {
      const authenticatedUserId = _.get('auth.user.id', req);
      if (authenticatedUserId) {
        userService.updateUser(
          { last_online: sequelize.fn('NOW') },
          { id: authenticatedUserId }
        )
      }
      next();
    };
  }
}

module.exports = new UserOnlineController();
