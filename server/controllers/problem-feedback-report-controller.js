const EventEmitter = require('events');
const _ = require('lodash/fp');

const { ProblemFeedbackReport, User, Rater, Provider, Feedback } = require('../models');
const problemFeedbackReportService = require('../services/problem-feedback-report.service');

const { sanitizeSubject } = require('./controller-utils/index');

class ProblemFeedbackReportController extends EventEmitter {
  constructor() {
    super();

    this.createProblemFeedbackReport = newProblemFeedbackReport => ProblemFeedbackReport
      .create(sanitizeSubject(newProblemFeedbackReport));

    /* read */

    this.getProblemFeedbackReportById = id => ProblemFeedbackReport.findById(id);

    this.getProblemFeedbackReportByIdAndUser = (problemFeedbackReportId, { id }) => ProblemFeedbackReport.findOne({
      where: { id: problemFeedbackReportId, user_id: id },
    });

    this.getAllProblemFeedbackReports = (offset, limit) => ProblemFeedbackReport.findAll({
      attributes: {
        exclude: ['file'],
      },
      include: [{
        model: User,
        attributes: [
          'login',
          'email',
          'role',
        ],
        include: [
          Rater,
          Provider,
        ],
      },
        Feedback],
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    this.getAllProblemFeedbackReportsByUser = ({ id }, offset, limit) => ProblemFeedbackReport.findAll({
      where: { user_id: id },
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    /* update */

    this.updateProblemFeedbackReportByIdAndUser = (problemFeedbackReportFields, problemFeedbackReportId, { id }) => problemFeedbackReportService.updateProblemFeedbackReport(
      sanitizeSubject(problemFeedbackReportFields), {
        where: { id: problemFeedbackReportId, user_id: id },
        returning: true,
        plain: true,
      });

    this.updateProblemFeedbackReportById = (problemFeedbackReportFields, problemFeedbackReportId) => problemFeedbackReportService.updateProblemFeedbackReport(
      sanitizeSubject(problemFeedbackReportFields), {
        where: { id: problemFeedbackReportId },
        returning: true,
        plain: true,
      });

    /* delete */

    this.deleteProblemFeedbackReportById = id => ProblemFeedbackReport.destroy({
      where: { id },
    });

    this.deleteProblemFeedbackReportByIdAndUser = (problemFeedbackReportId, { id }) => ProblemFeedbackReport.destroy({
      where: { id: problemFeedbackReportId, user_id: id },
    })
  }
}

module.exports = new ProblemFeedbackReportController();
