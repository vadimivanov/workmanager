const router = require('express').Router();

const notificationsController = require('../../../controllers/notifications-controller');
const { respondError, respondPayload } = require('../../router-utils');

const getAllFeedbackNotificationsReqHandler = (req, res) =>
  notificationsController.getAllFeedbackNotifications(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));

const getAllFeedbackRequestNotificationsReqHandler = (req, res) =>
  notificationsController.getAllFeedbackRequestNotifications(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));

const getAllPortfolioPhotoNotificationsReqHandler = (req, res) =>
  notificationsController.getAllPortfolioPhotoNotifications(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));

router.get('/feedback-notifications', getAllFeedbackNotificationsReqHandler);

router.get('/feedback-request-notifications', getAllFeedbackRequestNotificationsReqHandler);

router.get('/portfolio-photo-notifications', getAllPortfolioPhotoNotificationsReqHandler);

module.exports = router;
