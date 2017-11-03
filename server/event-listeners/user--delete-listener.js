const eventBus = require('../utils/event-bus');
const emailController = require('../controllers/email-controller');
const eventTypes = require('../../config/event-types.config.json');

class UserDeleteListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.user.USER_DELETE)
        .subscribe({
          next: event => event.payload.user.is_verified !== false
            ? emailController.deletedUserNotify(event.payload.user)
            : null,
        });
      return Promise.resolve();
    }
  }
}

module.exports = new UserDeleteListener();
