const router = require('express').Router();

const feedbackRequestController = require('../../../../controllers/feedback-request-controller');
const singleFeedbackRequestRouter = require('./single-feedback-request');
const { respondPayload, respondError } = require('../../../router-utils');

const getAllFeedbackRequestsReqHandler = (req, res) => {
  feedbackRequestController.getAllFeedbackRequests(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.use('/:feedback_request_id', singleFeedbackRequestRouter);

router.route('/')
  .get(getAllFeedbackRequestsReqHandler);

module.exports = router;
