const router = require('express').Router();

const AuthMiddleware = require('../../../../auth/auth-middleware-factory');
const notificationSettingsListController = require('../../../../controllers/notification-settings-list-controller');
const { respondPayload, respondError } = require('../../../router-utils');

const getNotificationSettingsListReqHandler = (req, res) => {
  notificationSettingsListController.getNotificationSettingsListByUser(req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateNotificationSettingsListReqHandler = (req, res) => {
  notificationSettingsListController.updateNotificationSettingsListByUser(req.body, req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/')
  .get(getNotificationSettingsListReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateNotificationSettingsListReqHandler);

module.exports = router;
