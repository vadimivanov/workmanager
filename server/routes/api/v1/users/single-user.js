const router = require('express').Router();
const _ = require('lodash/fp');

const AuthMiddleware = require('../../../../auth/auth-middleware-factory');
const notificationSettingsListRouter = require('./notification-settings-list');
const problemFeedbackReportsRouter = require('./problem-feedback-reports');
const userController = require('../../../../controllers/user-controller');
const { respondPayload, respondError } = require('../../../router-utils');

const getUserReqHandler = (req, res) => {
  if (_.get('meta.user', req)) {
    respondPayload(res)(req.meta.user);
  } else {
    userController.getUserById()
      .then(respondPayload(res))
  }
};

const updateUserReqHandler = (req, res) => {
  userController.updateUserById(req.body, req.meta.user.id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const deleteUserReqHandler = (req, res) => {
  userController.deleteUserWithStripeAccount(req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.use('/notification-settings-list', notificationSettingsListRouter);
router.use('/problem-feedback-reports', problemFeedbackReportsRouter);
router.use('/rater', require('./rater'));
router.use('/provider', require('./provider'));
router.use('/request-email-confirmation', require('./request-email-confirmation'));
router.use('/confirm-email', require('./confirm-email'));
router.use('/forgot-password', require('./forgot-password'));
router.use('/plan-limit', require('./plan-limit'));
router.use('/subscription', AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), require('./subscription'));
router.use('/billing-card', AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), require('./billing-card'));
router.use('/email', AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), require('./email'));
router.use('/billing', require('./billing'));

router.route('/')
  .get(getUserReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateUserReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), deleteUserReqHandler);

module.exports = router;
