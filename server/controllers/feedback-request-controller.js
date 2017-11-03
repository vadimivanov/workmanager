const EventEmitter = require('events');
const _ = require('lodash/fp');

const { FeedbackRequest, Provider } = require('../models');
const { sanitizeSubject } = require('./controller-utils');
const eventBus = require('../utils/event-bus');
const eventTypes = require('../../config/event-types.config.json');

class FeedbackRequestController extends EventEmitter {
  constructor() {
    super();

    this.createFeedbackRequest = (feedbackRequest, { id }) => FeedbackRequest
      .create(sanitizeSubject(Object.assign({}, feedbackRequest, { provider_id: id })))
      .then(this.emitFeedbackRequestCreated);

    /* get */

    this.getAllFeedbackRequests = (offset, limit) => FeedbackRequest.findAll({
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    this.getAllFeedbackRequestsByRater = ({ id }, offset, limit) => FeedbackRequest.findAll({
      where: { rater_id: id },
      offset,
      limit,
      include: {
        model: Provider,
        attributes: ['company_name', 'photo_url', 'id', 'user_id'],
      },
      order: [['created_at', 'DESC']],
    });

    this.getAllFeedbackRequestsByProvider = ({ id }, offset, limit) => FeedbackRequest.findAll({
      where: { provider_id: id },
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    this.getFeedbackRequestById = id => FeedbackRequest.findOne({
      where: { id },
    });

    this.getFeedbackRequestByIdAndProvider = (feedbackRequestId, { id }) => FeedbackRequest.findOne({
      where: { id: feedbackRequestId, provider_id: id },
    });

    this.getFeedbackRequestByIdAndRater = (feedbackRequestId, { id }) => FeedbackRequest.findOne({
      where: { id: feedbackRequestId, rater_id: id },
    });

    /* update */

    this.updateFeedbackRequestById = (feedbackFields, id) => FeedbackRequest.update(
      feedbackFields, {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    this.updateFeedbackRequestByIdAndProvider = (feedbackRequestFields, feedbackRequestId, { id }) => FeedbackRequest.update(
      feedbackRequestFields, {
        where: { id: feedbackRequestId, provider_id: id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    /* delete */

    this.deleteFeedbackRequestById = id => FeedbackRequest.destroy({
      where: { id },
    });

    this.deleteFeedbackRequestByIdAndProvider = (feedbackRequestId, { id }) => FeedbackRequest.destroy({
      where: { id: feedbackRequestId, provider_id: id },
    });

    this.deleteFeedbackRequestByIdAndRater = (feedbackRequestId, { id }) => this.getFeedbackRequestByIdAndRater(feedbackRequestId, { id })
      .then(foundFeedbackRequest => this.emitFeedbackRequestDeleteByRater(foundFeedbackRequest)
        .then(() => FeedbackRequest.destroy({
          where: { id: feedbackRequestId, rater_id: id },
        })));

    /* events */

    this._createEmitFeedbackRequestPromise = type => (feedbackRequest) => {
      eventBus.subject.next({
        type,
        payload: { feedbackRequest },
      });

      return Promise.resolve(feedbackRequest)
    };

    this.emitFeedbackRequestCreated = this._createEmitFeedbackRequestPromise(eventTypes.feedbackRequest.FEEDBACK_REQUEST_CREATED);
    this.emitFeedbackRequestDeleteByRater = this._createEmitFeedbackRequestPromise(eventTypes.feedbackRequest.FEEDBACK_REQUEST_DELETED_BY_RATER);
  }
}

module.exports = new FeedbackRequestController();

