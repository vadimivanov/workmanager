const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../../initialization/postgres-connect.initialization');
const feedbackNotificationService = require('../../../services/notifications/feedback-notification.service');
const feedbackController = require('../../../controllers/feedback-controller');
const [firstFeedback] = require('../../../../config/database/seeds/Feedbacks.seed.json');

const TEST_FEEDBACK = Object.assign({ id: undefined }, firstFeedback);

xdescribe('Feedback notification service', () => {
  let createdFeedback = null;

  before('Create new feedback', async () => {
    try {
      await initialization;
      createdFeedback = await feedbackController.createFeedback(TEST_FEEDBACK, { id: TEST_FEEDBACK.rater_id });
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Create feedback notification', async () => {
    try {
      const createdFeedbackNotification = await feedbackNotificationService.createFeedbackNotification(createdFeedback);
      expect(createdFeedbackNotification.feedback.id).to.be.equal(createdFeedback.id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  after('Delete feedback', async () => {
    try {
      await feedbackController.deleteFeedbackById(createdFeedback.id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
