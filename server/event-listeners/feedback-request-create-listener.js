const eventBus = require('../utils/event-bus');
const emailController = require('../controllers/email-controller');
const feedbackRequestNotificationService = require('../services/notifications/feedback-request-notification.service');
const eventTypes = require('../../config/event-types.config.json');

class FeedbackChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.feedbackRequest.FEEDBACK_REQUEST_CREATED)
        .subscribe({
          next: event => feedbackRequestNotificationService.createFeedbackRequestNotification(event.payload.feedbackRequest)
            .then(emailController.newFeedbackRequestNotify(event.payload.feedbackRequest)),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new FeedbackChangesListener();
