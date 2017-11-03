const router = require('express').Router();

const { respondPayload, respondError } = require('../../../../router-utils');
const feedbackRequestController = require('../../../../../controllers/feedback-request-controller');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');

const getAllRaterFeedbackRequestsReqHandler = (req, res) => {
  feedbackRequestController.getAllFeedbackRequestsByRater(req.meta.rater, req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res))
};

/* single feedback */

const getFeedbackRequestByIdAndRaterReqHandler = (req, res) => {
  feedbackRequestController.getFeedbackRequestByIdAndRater(req.params.feedback_request_id, req.meta.rater)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const deleteFeedbackRequestByIdAndRaterReqHandler = (req, res) => {
  feedbackRequestController.deleteFeedbackRequestByIdAndRater(req.params.feedback_request_id, req.meta.rater)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/:feedback_request_id')
  .get(getFeedbackRequestByIdAndRaterReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteFeedbackRequestByIdAndRaterReqHandler);

router.get('/', getAllRaterFeedbackRequestsReqHandler);

module.exports = router;
