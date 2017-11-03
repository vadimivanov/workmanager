const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;
const _ = require('lodash/fp');

const feedbackRequestController = require('../../controllers/feedback-request-controller');
const [userRater, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [feedbackRequest] = require('../../../config/database/seeds/FeedbackRequests.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const RATER = userRoles.RATER;
const PROVIDER = userRoles.PROVIDER;

const TEST_RATER = Object.assign({},
  userRater, {
    login: Date.now() + userRater.login,
    email: Date.now() + userRater.email,
  }
);

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

delete TEST_FEEDBACK_REQUEST.provider_id;

describe('Testing of routes of rater feedback requests', () => {
  const createdUsers = [];
  let createdProvider = null;
  let createdFeedbackRequestId = null;

  before('Create users and authorization', (done) => {
    supertest
      .post('/auth/sign-up/rater/')
      .set('Content-Type', 'application/json')
      .send(TEST_RATER)
      .expect(({ body }) => {
        expect(body.role).to.equal(RATER);
        createdUsers.push(body);
      })
      .end(() => {
        supertest
          .get(`/api/v1/users/${_.first(createdUsers).id}/rater`)
          .set('Content-Type', 'application/json')
          .expect(({ body }) => {
            expect(body).to.not.null;
            TEST_FEEDBACK_REQUEST.rater_id = body.id;
          })
          .end(() => {
            supertest
              .post('/auth/sign-up/provider/')
              .set('Content-Type', 'application/json')
              .send(TEST_PROVIDER)
              .expect(({ body }) => {
                expect(body.role).to.equal(PROVIDER);
                createdUsers.push(body);
              })
              .end(() => {
                supertest
                  .get(`/api/v1/users/${_.last(createdUsers).id}/provider`)
                  .set('Content-Type', 'application/json')
                  .expect(({ body }) => {
                    expect(body).to.not.null;
                    createdProvider = body;
                  })
                  .end(() => feedbackRequestController.createFeedbackRequest(TEST_FEEDBACK_REQUEST, createdProvider)
                    .then((newFeedbackRequest) => {
                      createdFeedbackRequestId = newFeedbackRequest.id;
                      done();
                    })
                    .catch((e) => {
                      console.error(e.message);
                      expect(e).to.not.exist;
                    })
                  );
              });
          });
      });
  });

  it('Get all rater feedback requests', (done) => {
    supertest
      .get(`/api/v1/users/${_.first(createdUsers).id}/rater/feedback-requests`)
      .set('Content-Type', 'application/json')
      .expect(({ body }) => {
        expect(body).to.be.instanceof(Array);
        expect(body).to.have.length.of.at.least(1);
        expect(_.last(body).message).to.equal(TEST_FEEDBACK_REQUEST.message);
      })
      .end(done);
  });

  it('Get feedback requests by id adn rater', (done) => {
    supertest
      .get(`/api/v1/users/${_.first(createdUsers).id}/rater/feedback-requests/${createdFeedbackRequestId}`)
      .set('Content-Type', 'application/json')
      .expect(({ body }) => {
        expect(body.message).to.equal(TEST_FEEDBACK_REQUEST.message);
      })
      .end(done);
  });

  after('Delete users from db', (done) => {
    Promise.all(createdUsers.map(user => userUtils.deleteUser(user)))
      .then(() => done())
      .catch((err) => {
        console.log(err.message);
        expect(err).to.not.exist;
      })
  });
});
