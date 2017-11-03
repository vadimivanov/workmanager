const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Feedback } = require('../models');
const { sanitizeSubject } = require('../controllers/controller-utils');
const eventBus = require('../utils/event-bus');
const eventTypes = require('../../config/event-types.config.json');
const feedbackNotificationService = require('../services/notifications/feedback-notification.service');

class FeedbackService extends EventEmitter {
  constructor() {
    super();

    this.getFeedbackById = id => {
      return Feedback.findById(id)
    }

    /**
     * @param feedback {Feedback}
     * @param rater {Rater}
     */
    this.createFeedback = (feedback, rater) => Feedback
      .create(Object.assign({}, feedback, { rater_id: rater.id }))
      .then(createdFeedback => this.emitFeedbackCreated(Object.assign({}, JSON.parse(JSON.stringify(createdFeedback)), { feedback_request_id: feedback.feedback_request_id })));

    /* update */

    this.updateFeedback = (feedbackFields, predicate) => Feedback.findById(predicate.where.id)
      .then(this.emitFeedbackWillChange)
      .then(foundFeedback => _.isUndefined(feedbackFields.replies) && _.isUndefined(feedbackFields.is_displaying_quote)
        ? feedbackNotificationService.updateFeedbackNotificationStatus(Object.assign({}, JSON.parse(JSON.stringify(foundFeedback)),
          {
            is_viewed: _.isUndefined(feedbackFields.is_viewed)
              ? false
              : feedbackFields.is_viewed,
          }))
        : null
      )
      .then(() =>
        Feedback.update(feedbackFields, predicate)
        .then(_.last)
      )
      .then(feedback => _.isUndefined(feedbackFields.replies) && _.isUndefined(feedbackFields.is_displaying_quote)
        ? this.emitFeedbackChanged(Object.assign({}, JSON.parse(JSON.stringify(feedback)), { reason_reject: feedbackFields.reason_reject }))
        : feedback
      );

    /* events */

    this._createEmitFeedbackPromise = type => (feedback) => {
      eventBus.subject.next({
        type,
        payload: { feedback },
      });

      return feedback
    };

    this.emitFeedbackCreated = this._createEmitFeedbackPromise(eventTypes.feedback.FEEDBACK_CREATED);
    this.emitFeedbackWillChange = this._createEmitFeedbackPromise(eventTypes.feedback.FEEDBACK_WILL_CHANGE);
    this.emitFeedbackChanged = this._createEmitFeedbackPromise(eventTypes.feedback.FEEDBACK_CHANGED);
  }
}

module.exports = new FeedbackService();
