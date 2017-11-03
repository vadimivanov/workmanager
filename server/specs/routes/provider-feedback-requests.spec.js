const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;

const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [feedbackRequest] = require('../../../config/database/seeds/FeedbackRequests.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const PROVIDER = userRoles.PROVIDER;

const TEST_PROVIDER = Object.assign({},
  userProvider, {
    login: Date.now() + userProvider.login,
    email: Date.now() + userProvider.email,
  }
);

const TEST_FEEDBACK_REQUEST = Object.assign({},
  feedbackRequest, {
    message: Date.now() + feedbackRequest.message,
  }
);

const NEW_FIELDS = {
  job_title: 'Kitchen',
  message: 'New kitchen',
};

delete TEST_FEEDBACK_REQUEST.provider_id;

describe('Testing of routes of provider feedback requests', () => {
  let createdUserProvider = null;
  let authorizationToken = null;
  let createdFeedbackRequestId = null;

  before('Create provider and authorization', (done) => {
    supertest
      .post('/auth/sign-up/provider/')
      .set('Content-Type', 'application/json')
      .send(TEST_PROVIDER)
      .expect(({ body }) => {
        expect(body.role).to.equal(PROVIDER);
        createdUserProvider = body;
      })
      .end(() => {
        supertest
          .post('/auth/sign-in/')
          .set('Content-Type', 'application/json')
          .send(TEST_PROVIDER)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(({ body }) => {
            expect(body).to.not.null;
            authorizationToken = body.JWT;
          })
          .end(done);
      })
  });

  it('Create feedback request', (done) => {
    supertest
      .post(`/api/v1/users/${createdUserProvider.id}/provider/feedback-requests`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(TEST_FEEDBACK_REQUEST)
      .expect(({ body }) => {
        expect(body.message).to.equal(TEST_FEEDBACK_REQUEST.message);
        createdFeedbackRequestId = body.id;
      })
      .end(done);
  });

  it('Update feedback request', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserProvider.id}/provider/feedback-requests/${createdFeedbackRequestId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(NEW_FIELDS)
      .expect(({ body }) => {
        expect(body.message).to.equal(NEW_FIELDS.message);
        expect(body.job_title).to.equal(NEW_FIELDS.job_title);
      })
      .end(done);
  });

  it('Delete feedback request', (done) => {
    supertest
      .delete(`/api/v1/users/${createdUserProvider.id}/provider/feedback-requests/${createdFeedbackRequestId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .expect(({ body }) => {
        expect(body).to.be.empty;
      })
      .end(done);
  });

  after('Delete provider from db', (done) => {
    userUtils.deleteUser(createdUserProvider)
      .then(() => done())
      .catch((err) => {
        console.log(err.message);
        expect(err).to.not.exist;
      })
  });
});
