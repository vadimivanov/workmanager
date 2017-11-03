const router = require('express').Router();

const _ = require('lodash/fp');
const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const feedbackController = require('../../../../../controllers/feedback-controller');
const planLimitController = require('../../../../../controllers/plan-limit-controller');
const { respondPayload, respondError } = require('../../../../router-utils');

const getAllProviderFeedbacksReqHandler = (req, res) => {
  feedbackController.getAllFeedbacksByProvider(_.get('auth.user', req), req.meta.provider, req.query.offset, req.query.limit)
    .then(planLimitController.filterFeedbackQuotes(_.get('auth.user', req), req.meta.provider))
    .then(respondPayload(res))
    .catch(respondError(res))
};

const getProviderFeedbackReqHandler = (req, res) => {
  feedbackController.getFeedbackByIdAndProvider(req.params.feedback_id, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateProviderFeedbackReqHandler = (req, res) => {
  feedbackController.updateProviderRelatedFieldsById(req.body, req.params.feedback_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/:feedback_id')
  .get(getProviderFeedbackReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateProviderFeedbackReqHandler);

router.get('/', getAllProviderFeedbacksReqHandler);

module.exports = router;
