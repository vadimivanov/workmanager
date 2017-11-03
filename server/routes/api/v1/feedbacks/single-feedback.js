const router = require('express').Router({ mergeParams: true });

const auth = require('../../../../auth');
const AuthMiddleware = require('../../../../auth/auth-middleware-factory');
const feedbackController = require('../../../../controllers/feedback-controller');
const { respondPayload, respondError } = require('../../../router-utils');

const getFeedbackByIdReqHandler = (req, res) => {
  feedbackController.getFeedbackById(req.params.feedback_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateFeedbackByIdReqHandler = (req, res) => {
  feedbackController.updateFeedbackById(req.body, req.params.feedback_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const deleteFeedbackByIdReqHandler = (req, res) => {
  feedbackController.deleteFeedbackById(req.params.feedback_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/')
  .get(getFeedbackByIdReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), updateFeedbackByIdReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), deleteFeedbackByIdReqHandler);

module.exports = router;
