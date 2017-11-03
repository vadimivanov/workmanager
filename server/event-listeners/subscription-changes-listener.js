const eventBus = require('../utils/event-bus');
const planLimitController = require('../controllers/plan-limit-controller');
const eventTypes = require('../../config/event-types.config.json');

class StripeSubscriptionListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.subscribe.SUBSCRIBE_CHANGED)
        .subscribe({
          next: event => planLimitController.checkingQuantityPhotosInTimeOfChangingPlan(event.payload.user),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new StripeSubscriptionListener();
