const eventBus = require('../utils/event-bus');
const emailController = require('../controllers/email-controller');
const eventTypes = require('../../config/event-types.config.json');

class FeedbackChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.feedbackRequest.FEEDBACK_REQUEST_DELETED_BY_RATER)
        .subscribe({
          next: event => emailController.deletingFeedbackRequestNotify(event.payload.feedbackRequest),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new FeedbackChangesListener();
