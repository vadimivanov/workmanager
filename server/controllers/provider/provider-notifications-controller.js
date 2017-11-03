const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Feedback, FeedbackNotification } = require('../../models');
const notificationSettingsListController = require('../notification-settings-list-controller');

class ProviderNotificationsController extends EventEmitter {
  constructor() {
    super();

    /**
     * @private
     * @param provider {Provider}
     */
    this._getAllNotifications = provider => FeedbackNotification.findAll({
      where: { prev_feedback: null },
      include: [{
        model: Feedback,
        where: { provider_id: provider.id },
      }],
      order: [['created_at', 'ASC']],
    })

    /**
     * @param user {User}
     */
    this.getNotifications = user => notificationSettingsListController.getNotificationSettingsListByUser(user)
      .then((notificationSettingsList) => {
        if (!notificationSettingsList.is_feedbacks_notify) return Promise.resolve(null);
        return this._getAllNotifications({ id: user.provider_id })
      })
  }
}

module.exports = new ProviderNotificationsController();
