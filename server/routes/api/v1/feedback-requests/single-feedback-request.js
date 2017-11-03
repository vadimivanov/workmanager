const router = require('express').Router({ mergeParams: true });

const auth = require('../../../../auth');
const AuthMiddleware = require('../../../../auth/auth-middleware-factory');
const feedbackRequestController = require('../../../../controllers/feedback-request-controller');
const { respondPayload, respondError } = require('../../../router-utils');

const getFeedbackRequestByIdReqHandler = (req, res) => {
  feedbackRequestController.getFeedbackRequestById(req.params.feedback_request_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateFeedbackRequestByIdReqHandler = (req, res) => {
  feedbackRequestController.updateFeedbackRequestById(req.body, req.params.feedback_request_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const deleteFeedbackByIdReqHandler = (req, res) => {
  feedbackRequestController.deleteFeedbackRequestById(req.params.feedback_request_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/')
  .get(getFeedbackRequestByIdReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), updateFeedbackRequestByIdReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), deleteFeedbackByIdReqHandler);

module.exports = router;
