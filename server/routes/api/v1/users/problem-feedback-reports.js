const router = require('express').Router();

const AuthMiddleware = require('../../../../auth/auth-middleware-factory');
const problemFeedbackReportController = require('../../../../controllers/problem-feedback-report-controller');
const { respondPayload, respondError } = require('../../../router-utils');

/* single problem feedback report*/

const getProblemFeedbackReportReqHandler = (req, res) => {
  problemFeedbackReportController.getProblemFeedbackReportByIdAndUser(req.params.problem_feedback_report_id, req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const updateProblemFeedbackReportReqHandler = (req, res) => {
  problemFeedbackReportController.updateProblemFeedbackReportById(req.body, req.params.problem_feedback_report_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteProblemFeedbackReportReqHandler = (req, res) => {
  problemFeedbackReportController.deleteProblemFeedbackReportByIdAndUser(req.params.problem_feedback_report_id, req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res));
};

/* problem feedback reports */

const createProblemFeedbackReportReqHandler = (req, res) => {
  problemFeedbackReportController.createProblemFeedbackReport(req.body)
    .then(respondPayload(res))
    .catch(respondError(res));
};
const getAllProblemFeedbackReportsReqHandler = (req, res) => {
  problemFeedbackReportController.getAllProblemFeedbackReportsByUser(req.meta.user, req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:problem_feedback_report_id')
  .get(getProblemFeedbackReportReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateProblemFeedbackReportReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteProblemFeedbackReportReqHandler);

router.route('/')
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createProblemFeedbackReportReqHandler)
  .get(getAllProblemFeedbackReportsReqHandler);

module.exports = router;
