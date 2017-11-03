const router = require('express').Router();

const feedbackController = require('../../../../controllers/feedback-controller');
const singleFeedbackRouter = require('./single-feedback');
const { respondPayload, respondError } = require('../../../router-utils');

const getAllFeedbacksReqHandler = (req, res) => {
  feedbackController.getAllFeedbacks(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.use('/:feedback_id', singleFeedbackRouter);

router.route('/')
  .get(getAllFeedbacksReqHandler);

module.exports = router;
