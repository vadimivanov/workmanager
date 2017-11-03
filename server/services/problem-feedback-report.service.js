const EventEmitter = require('events');
const _ = require('lodash/fp');

const { ProblemFeedbackReport } = require('../models');
const eventBus = require('../utils/event-bus');
const eventTypes = require('../../config/event-types.config.json');

class ProblemFeedbackReportService extends EventEmitter {
  constructor() {
    super();

    /* update */

    this.updateProblemFeedbackReport = (problemFeedbackReportFields, predicate) => ProblemFeedbackReport.update(problemFeedbackReportFields, predicate)
      .then(_.last)
      .then(this.emitProblemFeedbackReportChanged);

    /* events */

    this._createEmitProblemFeedbackReportPromise = type => (problemFeedbackReport) => {
      eventBus.subject.next({
        type,
        payload: { problem_feedback_report: _.get('dataValues', problemFeedbackReport) },
      });

      return problemFeedbackReport
    };

    this.emitProblemFeedbackReportChanged = this._createEmitProblemFeedbackReportPromise(eventTypes.problemFeedbackReport.PROBLEM_FEEDBACK_REPORT_CHANGED);
  }
}

module.exports = new ProblemFeedbackReportService();
