const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const userUtils = require('../helpers/user-management.helper');
const initialization = require('../../initialization/postgres-connect.initialization');
const feedbackRequestController = require('../../controllers/feedback-request-controller');
const [userRater, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [firstRater] = require('../../../config/database/seeds/Raters.seed.json');
const [firstProvider] = require('../../../config/database/seeds/Providers.seed.json');
const [testFeedbackRequest] = require('../../../config/database/seeds/FeedbackRequests.seed.json');

const TEST_FEEDBACK_REQUEST = Object.assign({},
  testFeedbackRequest,
  { id: undefined },
  { project_cost: undefined },
  { rater_id: undefined },
  { provider_id: undefined },
);

describe('Feedback request controller', () => {
  let createdUserProvider = null;
  let createdFeedbackRequest = null;

  before('Create new user rater and feedback', async () => {
    try {
      await initialization;
      createdUserProvider = await userUtils.createUniqueUserProvider(userProvider, firstProvider);
      createdFeedbackRequest = await feedbackRequestController.createFeedbackRequest(TEST_FEEDBACK_REQUEST, createdUserProvider.Provider);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get single feedback by users ID', async () => {
    try {
      const singleFeedbackRequest = await feedbackRequestController.getFeedbackRequestById(createdFeedbackRequest.id);
      expect(singleFeedbackRequest.message).to.be.equal(TEST_FEEDBACK_REQUEST.message)
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Update single feedback request by users ID', async () => {
    try {
      const singleFeedbackRequest = await feedbackRequestController.updateFeedbackRequestById(createdFeedbackRequest.dataValues, createdFeedbackRequest.id);
      expect(singleFeedbackRequest.message).to.be.equal(TEST_FEEDBACK_REQUEST.message)
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  after('Delete user', async () => {
    try {
      await userUtils.deleteUser(createdUserProvider);
      await feedbackRequestController.deleteFeedbackRequestById(createdFeedbackRequest.id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
