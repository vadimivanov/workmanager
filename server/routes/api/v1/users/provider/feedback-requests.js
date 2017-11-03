const router = require('express').Router();

const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const feedbackRequestController = require('../../../../../controllers/feedback-request-controller');
const planLimitController = require('../../../../../controllers/plan-limit-controller');
const { respondPayload, respondError } = require('../../../../router-utils');

const getAllProviderFeedbackRequestsReqHandler = (req, res) => {
  feedbackRequestController.getAllFeedbackRequestsByProvider(req.meta.provider, req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res))
};

/* single feedback */

const createFeedbackRequestReqHandler = (req, res) => {
  planLimitController.checkQuantityPhotosInRequestFeedback(req.body, req.meta.provider)
    .then(() => feedbackRequestController.createFeedbackRequest(req.body, req.meta.provider)
      .then(respondPayload(res)))
    .catch(respondError(res))
};

const getFeedbackRequestReqHandler = (req, res) => {
  feedbackRequestController.getFeedbackRequestByIdAndProvider(req.params.feedback_request_id, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateFeedbackRequestReqHandler = (req, res) => {
  feedbackRequestController.updateFeedbackRequestByIdAndProvider(req.body, req.params.feedback_request_id, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const deleteFeedbackRequestReqHandler = (req, res) => {
  feedbackRequestController.deleteFeedbackRequestByIdAndProvider(req.params.feedback_request_id, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/:feedback_request_id')
  .get(getFeedbackRequestReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateFeedbackRequestReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteFeedbackRequestReqHandler);

router.route('/')
  .get(getAllProviderFeedbackRequestsReqHandler)
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createFeedbackRequestReqHandler);

module.exports = router;
