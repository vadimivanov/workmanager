const eventBus = require('../utils/event-bus');
const userController = require('../controllers/user-controller');
const eventTypes = require('../../config/event-types.config.json');

class FeedbackChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.email.EMAIL_USER_REGISTRATION_FAILED)
        .subscribe({
          next: event => userController.deleteUserWithStripeAccount(event.payload.user),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new FeedbackChangesListener();
