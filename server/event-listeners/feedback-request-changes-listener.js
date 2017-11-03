const eventBus = require('../utils/event-bus');
const feedbackRequestNotificationService = require('../services/notifications/feedback-request-notification.service');
const eventTypes = require('../../config/event-types.config.json');

class FeedbackRequestChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.feedbackRequest.FEEDBACK_REQUEST_CREATED)
        // .subscribe({
        //   next: event => feedbackRequestNotificationService.createFeedbackRequestNotification(event.payload.feedbackRequest),
        // })
    }
  }
}

module.exports = new FeedbackRequestChangesListener();
