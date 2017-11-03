const eventBus = require('../utils/event-bus');
const portfolioPhotoNotificationService = require('../services/notifications/portfolio-photo-notification.service');
const eventTypes = require('../../config/event-types.config.json');
const _ = require('lodash/fp');


class PorfolioPhotoChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.portfolioPhoto.PORTFOLIO_PHOTO_CHANGED)
        // .subscribe({
        //   next: event => !_.isUndefined(_.get('is_viewed', event.payload.portfolioPhoto)) ? portfolioPhotoNotificationService.updatePortfolioPhotoNotificationStatus(event.payload.portfolioPhoto) : null,
        // })
    }
  }
}

module.exports = new PorfolioPhotoChangesListener();
