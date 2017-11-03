const EventEmitter = require('events');
const _ = require('lodash/fp');

const { NotificationSettingsList } = require('../models');
const { sanitizeSubject } = require('./controller-utils');

class NotificationSettingsListController extends EventEmitter {
  constructor() {
    super();

    this.createNotificationSettingsListForUser = (notificationSettingsList, user) => NotificationSettingsList.create(
      Object.assign({},
        sanitizeSubject(notificationSettingsList),
        { user_id: user.id })
    );

    this.createDefaultNotificationSettingsListForUser = (user, { is_feedbacks_notify, is_feedbacks_request_notify }) => this.createNotificationSettingsListForUser(
      {
        email_for_notifications: user.email,
        is_feedbacks_notify,
        is_feedbacks_request_notify,
      },
      user);

    this.getNotificationSettingsListById = id => NotificationSettingsList.findOne({
      where: { id },
    });

    this.getNotificationSettingsListByUser = ({ id }) => NotificationSettingsList.findOne({
      where: { user_id: id },
    });

    this.updateNotificationSettingsListByUser = (newNotificationSettingsListFields, { id }) => NotificationSettingsList.update(
      sanitizeSubject(newNotificationSettingsListFields), {
        where: { user_id: id },
        returning: true,
        plain: true,
      })
      .then(_.last);
  }
}

module.exports = new NotificationSettingsListController();
