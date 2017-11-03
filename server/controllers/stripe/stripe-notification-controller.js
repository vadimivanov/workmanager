const EventEmitter = require('events');
const _ = require('lodash/fp');

const { StripeNotification } = require('../../models');

class StripeNotificationController extends EventEmitter {
  constructor() {
    super();

    /* create */

    this.createStripeNotification = stripeNotification => this.getStripeNotificationByStripeNotificationId(stripeNotification.id)
      .then((foundNotification) => {
        return _.isEmpty(foundNotification)
          ? StripeNotification.create(this._sanitizeNotificationObject(stripeNotification))
          : { success: false, message: 'This notification already exist.' }
      });

    /* get */

    this.getStripeNotificationById = id => StripeNotification.findOne({
      where: { id },
    });

    this.getStripeNotificationByStripeNotificationId = id => StripeNotification.findOne({
      where: { stripe_notification_id: id },
    });

    this.getAllStripeNotifications = (offset, limit) => StripeNotification.findAll({
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    /* update */

    this.updateStripeNotificationById = (newStripeNotification, id) => StripeNotification.update(
      this._sanitizeNotificationObject(newStripeNotification),
      {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    /* delete */

    this.deleteStripeNotificationById = id => StripeNotification.destroy({
      where: { id },
    });

    this._sanitizeNotificationObject = (stripeNotification) => {
      const notificationId = stripeNotification.id;
      const clonedStripeNotification = Object.assign({}, stripeNotification);
      delete clonedStripeNotification.id;
      return Object.assign({}, clonedStripeNotification, { stripe_notification_id: notificationId });
    }
  }
}

module.exports = new StripeNotificationController();
