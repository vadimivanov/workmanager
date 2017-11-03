const eventBus = require('../utils/event-bus');
const emailController = require('../controllers/email-controller');
const feedbackController = require('../controllers/feedback-controller');
const eventTypes = require('../../config/event-types.config.json');

class FeedbackChangesListener {
  constructor() {
    this.initialize = () => {

      eventBus.subject
        .filter(event => event.type === eventTypes.problemFeedbackReport.PROBLEM_FEEDBACK_REPORT_CHANGED)
        .subscribe({
          next: event => event.payload.problem_feedback_report.is_approved
            ? feedbackController.updateFeedbackById({ is_displaying: false }, event.payload.problem_feedback_report.feedback_id)
              .then(emailController.problemFeedbackReportNotify(event.payload.problem_feedback_report))
            : emailController.problemFeedbackReportNotify(event.payload.problem_feedback_report),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new FeedbackChangesListener();
