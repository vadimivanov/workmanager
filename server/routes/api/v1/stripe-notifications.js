const router = require('express').Router();
const _ = require('lodash/fp');
const log = require('../../../utils/logger/logger')(module);

const { respondPayload, respondError } = require('../../router-utils');
const stripeNotificationController = require('../../../controllers/stripe/stripe-notification-controller');

const createStripeNotificationReqHandler = (req, res) => stripeNotificationController.createStripeNotification(req.body)
  .then(respondPayload(res))
  .catch(respondError(res));

const getAllStripeNotificationsReqHandler = (req, res) => stripeNotificationController.getAllStripeNotifications(req.query.offset, req.query.limit)
  .then(respondPayload(res))
  .catch(respondError(res));

const getStripeNotificationReqHandler = (req, res) => stripeNotificationController.getStripeNotificationById(req.params.stripe_notification_id)
  .then(respondPayload(res))
  .catch(respondError(res));

const updateStripeNotificationReqHandler = (req, res) => stripeNotificationController.updateStripeNotificationById(req.body, req.params.stripe_notification_id)
  .then(respondPayload(res))
  .catch(respondError(res));

const removeStripeNotificationReqHandler = (req, res) => stripeNotificationController.deleteStripeNotificationById(req.params.stripe_notification_id)
  .then(respondPayload(res))
  .catch(respondError(res));

router.route('/')
  .get(getAllStripeNotificationsReqHandler)
  .post(createStripeNotificationReqHandler);

router.route('/:stripe_notification_id')
  .get(getStripeNotificationReqHandler)
  .put(updateStripeNotificationReqHandler)
  .delete(removeStripeNotificationReqHandler);

module.exports = router;
