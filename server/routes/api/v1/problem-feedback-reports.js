const router = require('express').Router();

const AuthMiddleware = require('../../../auth/auth-middleware-factory');
const problemFeedbackReportController = require('../../../controllers/problem-feedback-report-controller');
const { respondPayload, respondError } = require('../../router-utils');

const getProblemFeedbackReportReqHandler = (req, res) => {
  problemFeedbackReportController.getProblemFeedbackReportById(req.params.problem_feedback_report_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteProblemFeedbackReportReqHandler = (req, res) => {
  problemFeedbackReportController.deleteProblemFeedbackReportById(req.params.problem_feedback_report_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllProblemFeedbackReportsReqHandler = (req, res) => {
  problemFeedbackReportController.getAllProblemFeedbackReports(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:problem_feedback_report_id')
  .get(getProblemFeedbackReportReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), deleteProblemFeedbackReportReqHandler);

router.route('/')
  .get(getAllProblemFeedbackReportsReqHandler);

module.exports = router;
