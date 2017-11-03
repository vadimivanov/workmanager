const EventEmitter = require('events');
const _ = require('lodash/fp');

const { PortfolioPhoto, Provider } = require('../models');
const sequelize = require('../models').sequelize;
const eventBus = require('../utils/event-bus');
const eventTypes = require('../../config/event-types.config.json');
const { sanitizeSubject } = require('./controller-utils/index');
const portfolioPhotoNotificationService = require('../services/notifications/portfolio-photo-notification.service');
const roles = require('../../config/database/enums/UserRoles.enum.json');

class PortfolioPhotoController extends EventEmitter {
  constructor() {
    super();

    this.createPortfolioPhoto = (portfolioPhoto, { id }) => PortfolioPhoto
      .create(sanitizeSubject(Object.assign({}, portfolioPhoto, { provider_id: id })))
      .then(this.emitPortfolioPhotoCreated);

    this.getAllPortfolioPhotosByProvider = (authenticatedUser, { id, user_id }, offset, limit) => PortfolioPhoto.findAll({
      where: (_.get('id', authenticatedUser) === user_id || _.get('role', authenticatedUser) === roles.ADMIN)
        ? { provider_id: id }
        : {
          provider_id: id,
          is_approved: true,
          is_visible: true,
        },
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    this._getAllProviderPortfolioPhotos = ({ id }) => PortfolioPhoto.findAll({
      where: { provider_id: id },
      order: [['created_at', 'ASC']],
    });

    this.getAllInspirationPortfolioPhotos = (offset, limit) => PortfolioPhoto.findAll({
      where: { is_idea_for_inspiration: true },
      offset,
      limit,
      include: [Provider],
      order: [sequelize.fn('RANDOM')],
    });

    this.getAllPortfolioPhotosByInspirationCategory = (id, offset, limit) => PortfolioPhoto.findAll({
      where: { is_idea_for_inspiration: true, inspiration_category_id: id },
      offset,
      limit,
      include: [Provider],
      order: [sequelize.fn('RANDOM')],
    });

    this.getPortfolioPhotoById = id => PortfolioPhoto.findOne({
      where: { id },
    });

    this.updatePortfolioPhotoByIdAndProvider = (newPortfolioPhoto, id, provider) => portfolioPhotoNotificationService.updatePortfolioPhotoNotificationStatus({ id, is_viewed: newPortfolioPhoto.is_viewed })
      .then(() => PortfolioPhoto.update(
      sanitizeSubject(newPortfolioPhoto), {
        where: { id, provider_id: provider.id },
        returning: true,
        plain: true,
      })
      .then(_.last));

    this.updatePortfolioPhotoById = ({ id }, portflioPhotoFields) => PortfolioPhoto.update(
      sanitizeSubject(portflioPhotoFields), {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    this.deletePortfolioPhotoById = id => PortfolioPhoto.destroy({
      where: { id },
    })
      .then(portfolioPhotoNotificationService.deletePortfolioPhotoNotification(id));

    /* events */

    this._createEmitPortfolioPhotoPromise = type => (portfolioPhoto) => {
      eventBus.subject.next({
        type,
        payload: { portfolioPhoto },
      });

      return Promise.resolve(portfolioPhoto)
    };

    this.emitPortfolioPhotoCreated = this._createEmitPortfolioPhotoPromise(eventTypes.portfolioPhoto.PORTFOLIO_PHOTO_CREATED);
    this.emitPortfolioPhotoChanged = this._createEmitPortfolioPhotoPromise(eventTypes.portfolioPhoto.PORTFOLIO_PHOTO_CHANGED);
    this.emitPortfolioPhotoDeleted = this._createEmitPortfolioPhotoPromise(eventTypes.portfolioPhoto.PORTFOLIO_PHOTO_DELETED);
  }
}

module.exports = new PortfolioPhotoController();
