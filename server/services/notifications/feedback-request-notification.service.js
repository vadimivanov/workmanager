const EventEmitter = require('events');

const { FeedbackRequestNotification } = require('../../models');

/**
 * @singleton
 */
class FeedbackRequestNotificationService extends EventEmitter {
  constructor() {
    super();

    /**
     * Create notification about feedback request
     * @param feedbackRequest {FeedbackRequest}
     */
    this.createFeedbackRequestNotification = feedbackRequest => FeedbackRequestNotification.create({
      feedback_request_id: feedbackRequest.id,
      prev_feedback_request: null,
    });
  }
}

module.exports = new FeedbackRequestNotificationService();
