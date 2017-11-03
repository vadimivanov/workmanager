const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Feedback, FeedbackRequest, FeedbackNotification, FeedbackRequestNotification } = require('../../models');
const notificationSettingsListController = require('../notification-settings-list-controller');

class RaterNotificationsController extends EventEmitter {
  constructor() {
    super();

    /**
     * @param rater {Rater}
     */
    this._getAllNotifications = rater => Promise.all([
      this._getFeedbackNotifications(rater),
      this._getFeedbackRequestNotifications(rater)
    ])
      .then(_.flatten);

    this._getFeedbackNotifications = rater => FeedbackNotification.findAll({
      where: {
        prev_feedback: { $ne: null },
      },
      include: [{
        model: Feedback,
        where: { rater_id: rater.id },
      }],
    })

    this._getFeedbackRequestNotifications = rater => FeedbackRequestNotification.findAll({
      where: {
        prev_feedback_request: null,
      },
      include: [{
        model: FeedbackRequest,
        where: { rater_id: rater.id },
      }],
    });

    /**
     * @param user {User}
     */
    this.getNotifications = user => notificationSettingsListController.getNotificationSettingsListByUser(user)
      .then((notificationSettingsList) => {
        if (!notificationSettingsList.is_feedbacks_notify) return Promise.resolve(null);
        return this._getAllNotifications({ id: user.rater_id })
      })
  }
}

module.exports = new RaterNotificationsController();
