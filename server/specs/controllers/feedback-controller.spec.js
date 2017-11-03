const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const userUtils = require('../helpers/user-management.helper');
const initialization = require('../../initialization/postgres-connect.initialization');
const feedbackController = require('../../controllers/feedback-controller');
const [userRater, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [firstRater] = require('../../../config/database/seeds/Raters.seed.json');
const [firstProvider] = require('../../../config/database/seeds/Providers.seed.json');
const [testFeedback] = require('../../../config/database/seeds/Feedbacks.seed.json');

const TEST_FEEDBACK = Object.assign({},
  testFeedback,
  { id: undefined },
  { company_name: 'test-company-name' },
  { project_cost: undefined },
  { rater_id: undefined },
  { provider_id: firstProvider.id },
);

describe('Feedback controller', () => {
  let createdUserRater = null;
  let createdFeedback = null;

  before('Create new user rater and feedback', async () => {
    try {
      await initialization;
      createdUserRater = await userUtils.createUniqueUserRater(userRater, firstRater);
      createdFeedback = await feedbackController.createFeedback(TEST_FEEDBACK, firstRater);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Create a feedback for unregistered provider', async () => {
    try {
      const UNREGISTRED_PROVIDER_FEEDBACK = Object.assign({
        provider_email: `${Date.now()}-test-${userProvider.email}`,
      }, TEST_FEEDBACK);

      delete UNREGISTRED_PROVIDER_FEEDBACK.provider_id

      createdFeedback = await feedbackController.createFeedback(UNREGISTRED_PROVIDER_FEEDBACK, firstRater);
      expect(createdFeedback.job_description).to.be.equal(TEST_FEEDBACK.job_description)
      //clear
      await userUtils.deleteUserByProviderId(createdFeedback.provider_id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get single feedback by users ID', async () => {
    try {
      const singleFeedback = await feedbackController.getFeedbackById(createdFeedback.id);
      expect(singleFeedback.job_description).to.be.equal(TEST_FEEDBACK.job_description)
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Update single feedback by users ID', async () => {
    try {
      const singleFeedback = await feedbackController.updateFeedbackById(createdFeedback.dataValues, createdFeedback.id);
      expect(singleFeedback.job_description).to.be.equal(TEST_FEEDBACK.job_description)
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Calculate average ', async () => {
    try {
      const averageRating = await feedbackController.getFeedbacksAverageRatingByProvider({ id: 1 });
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  after('Delete user', async () => {
    try {
      await userUtils.deleteUser(createdUserRater);
      await feedbackController.deleteFeedbackById(createdFeedback.id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
