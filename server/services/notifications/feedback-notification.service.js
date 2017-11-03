const EventEmitter = require('events');
const _ = require('lodash/fp');

const { FeedbackNotification } = require('../../models');

/**
 * @singleton
 */
class FeedbackNotificationService extends EventEmitter {
  constructor() {
    super();
    this._prevFeedbacksCache = new Array(32); //part of limited collection emulation

    this._sameIdPredicate = feedback => prevFeedback => _.get('id', feedback) === _.get('id', prevFeedback);

    this._getFeedbackNotificationByFeedbackId = feedback => FeedbackNotification.findOne({
      where: { feedback_id: feedback.id },
    });

    /**
     * Create notifiaction about fedback, add previous feedback from cache if exists with same id
     * @param feedback {Feedback}
     * @param prevFeedback {Feedback}
     */
    this.createFeedbackNotification = (feedback, prevFeedback) => {
      return FeedbackNotification.create({
        feedback_id: feedback.id,
        prev_feedback: (prevFeedback
          ? JSON.stringify(prevFeedback)
          : _.findLast(this._sameIdPredicate(feedback), this._prevFeedbacksCache)
        ) || null,
      })
    };

    /**
     * Update notifiaction about fedback, add previous feedback from cache if exists with same id
     * @param prevFeedback {Feedback}
     */
    this.updateFeedbackNotification = (prevFeedback) => {
      return this._getFeedbackNotificationByFeedbackId(prevFeedback)
        .then((foundNotification) => {
          return FeedbackNotification.update({
            prev_feedback: _.findLast(this._sameIdPredicate(prevFeedback), this._prevFeedbacksCache),
          },
            {
              where: { id: _.get('id', foundNotification) },
              returning: true,
              plain: true,
            })
          .then(_.last)
        })
    };

    /**
     * Update notifiaction status
     * @param feedback {Feedback}
     */
    this.updateFeedbackNotificationStatus = (feedback) => {
      return this._getFeedbackNotificationByFeedbackId(feedback)
        .then((foundNotification) => {
          return !_.isUndefined(_.get('is_viewed', feedback))
            ? FeedbackNotification.update({
              is_viewed: _.get('is_viewed', feedback),
            },
              {
                where: { id: _.get('id', foundNotification) },
                returning: true,
                plain: true,
              })
          .then(_.last)
            : Promise.resolve()
        })
    };

    /**
     * Save previous feedback to cache
     * @param prevFeedback {Feedback}
     */
    this.cachePrevFeedback = prevFeedback => new Promise((resolve, reject) => {
      this._prevFeedbacksCache.shift();
      this._prevFeedbacksCache.push(prevFeedback);
      return resolve();
    })
  }
}

module.exports = new FeedbackNotificationService();
