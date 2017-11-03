const eventBus = require('../utils/event-bus');
const _ = require('lodash/fp');
const emailController = require('../controllers/email-controller');
const feedbackNotificationService = require('../services/notifications/feedback-notification.service');
const feedbackRequestController = require('../controllers/feedback-request-controller');
const eventTypes = require('../../config/event-types.config.json');

class FeedbackChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.feedback.FEEDBACK_CREATED)
        .subscribe({
          next: event => _.isNull(event.payload.feedback.feedback_request_id)
            ? emailController.newFeedbackNotify(event.payload.feedback)
            .then(feedbackNotificationService.createFeedbackNotification(event.payload.feedback, null))
            : feedbackRequestController.deleteFeedbackRequestById(event.payload.feedback.feedback_request_id)
              .then(emailController.newFeedbackNotify(event.payload.feedback)
                .then(feedbackNotificationService.createFeedbackNotification(event.payload.feedback, null))),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new FeedbackChangesListener();
