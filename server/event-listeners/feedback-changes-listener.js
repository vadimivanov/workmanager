const eventBus = require('../utils/event-bus');
const feedbackNotificationService = require('../services/notifications/feedback-notification.service');
const emailController = require('../controllers/email-controller');
const eventTypes = require('../../config/event-types.config.json');
const _ = require('lodash/fp');

class FeedbackChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.feedback.FEEDBACK_WILL_CHANGE)
        .subscribe({
          next: event => feedbackNotificationService.cachePrevFeedback(event.payload.feedback),
        });

      eventBus.subject
        .filter(event => event.type === eventTypes.feedback.FEEDBACK_CHANGED)
        .subscribe({
          next: event => event.payload.feedback.is_approved || _.isNull(event.payload.feedback.is_approved)
            ? feedbackNotificationService.updateFeedbackNotification(event.payload.feedback)
            : feedbackNotificationService.updateFeedbackNotification(event.payload.feedback)
              .then(emailController.rejectedFeedbackNotify(event.payload.feedback)),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new FeedbackChangesListener();
