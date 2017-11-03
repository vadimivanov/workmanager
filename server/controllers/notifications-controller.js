const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Feedback, FeedbackRequest, PortfolioPhoto, FeedbackNotification, FeedbackRequestNotification, PortfolioPhotoNotification, Rater, Provider } = require('../models');

class NotificationsController extends EventEmitter {
  constructor() {
    super();

    this.getAllFeedbackNotifications = (offset, limit) => FeedbackNotification.findAll({
      offset,
      limit,
      include: [{
        model: Feedback,
        include: [Rater],
      }],
      order: [['created_at', 'ASC']],
    });

    this.getAllFeedbackRequestNotifications = (offset, limit) => FeedbackRequestNotification.findAll({
      offset,
      limit,
      include: [{
        model: FeedbackRequest,
        include: [Provider],
      }],
      order: [['created_at', 'ASC']],
    });

    this.getAllPortfolioPhotoNotifications = (offset, limit) => PortfolioPhotoNotification.findAll({
      offset,
      limit,
      include: [{
        model: PortfolioPhoto,
        include: [Provider],
      }],
      order: [['created_at', 'ASC']],
    });
  }
}

module.exports = new NotificationsController();
