const router = require('express').Router();

const _ = require('lodash/fp');
const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const feedbackController = require('../../../../../controllers/feedback-controller');
const { respondPayload, respondError } = require('../../../../router-utils');

const getAllRaterFeedbacksReqHandler = (req, res) => {
  feedbackController.getAllFeedbacksByRater(_.get('auth.user', req), req.meta.rater, req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res))
};

/* single feedback */

const createRaterFeedbackReqHandler = (req, res) => {
  feedbackController.createFeedback(req.body, req.meta.rater)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const getRaterFeedbackReqHandler = (req, res) => {
  feedbackController.getFeedbackById(req.params.feedback_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateRaterFeedbackReqHandler = (req, res) => {
  feedbackController.updateRaterFeedbackById(req.body, req.meta.rater, req.params.feedback_id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const deleteRaterFeedbackReqHandler = (req, res) => {
  feedbackController.deleteFeedbackByIdAndRater(req.params.feedback_id, req.meta.rater)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/:feedback_id')
  .get(getRaterFeedbackReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateRaterFeedbackReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteRaterFeedbackReqHandler);

router.route('/')
  .get(getAllRaterFeedbacksReqHandler)
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createRaterFeedbackReqHandler);

module.exports = router;
