const eventBus = require('../utils/event-bus');
const portfolioPhotoNotificationService = require('../services/notifications/portfolio-photo-notification.service');
const eventTypes = require('../../config/event-types.config.json');

class PorfolioPhotoChangesListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.portfolioPhoto.PORTFOLIO_PHOTO_DELETED)
        // .subscribe({
        //   next: event => portfolioPhotoNotificationService.deletePortfolioPhotoNotification(event.payload.portfolioPhoto),
        // })
    }
  }
}

module.exports = new PorfolioPhotoChangesListener();
