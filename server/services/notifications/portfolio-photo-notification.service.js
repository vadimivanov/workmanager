const EventEmitter = require('events');
const _ = require('lodash/fp');

const { PortfolioPhotoNotification } = require('../../models');

/**
 * @singleton
 */
class PortfolioPhotoNotificationService extends EventEmitter {
  constructor() {
    super();

    this._getPortfolioPhotoNotificationByPortfolioPhotoId = portfolioPhoto => PortfolioPhotoNotification.findOne({
      where: { portfolio_photo_id: portfolioPhoto.id },
    });


    /**
     * Create notification about portfolio photo
     * @param portfolioPhoto {PortfolioPhoto}
     */
    this.createPortfolioPhotoNotification = portfolioPhoto => PortfolioPhotoNotification.create({
      portfolio_photo_id: portfolioPhoto.id,
      prev_portfoliophoto: null,
    });

    /**
     * Update notification about portfolio photo
     * @param id - PortfolioPhoto id
     * @param is_viewed
     */
    this.updatePortfolioPhotoNotificationStatus = ({ id, is_viewed }) => !_.isUndefined(is_viewed)
      ? PortfolioPhotoNotification.update({
        is_viewed },
        {
          where: { portfolio_photo_id: id },
          returning: true,
          plain: true,
        })
      .then(_.last)
      : Promise.resolve();

    /**
     * Delete notification about portfolio photo
     * @param portfolioPhoto {PortfolioPhoto}
     */
    this.deletePortfolioPhotoNotification = portfolioPhoto => PortfolioPhotoNotification.destroy({
      where: { portfolio_photo_id: portfolioPhoto.id },
    });
  }
}

module.exports = new PortfolioPhotoNotificationService();
