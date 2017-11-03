const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;
const _ = require('lodash/fp');

const feedbackController = require('../../controllers/feedback-controller');
const [userRater, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');
const [testFeedback] = require('../../../config/database/seeds/Feedbacks.seed.json');

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

const TEST_FEEDBACK = Object.assign({},
  testFeedback, {
    job_description: Date.now() + testFeedback.job_description,
    project_cost: [200, 400],
    replies: [{ id: 1, message: 'good feedback!' }],
  }
);

delete TEST_FEEDBACK.id;
delete TEST_FEEDBACK.provider_id;
delete TEST_FEEDBACK.rater_id;

describe('Testing of routes of provider feedbacks', () => {
  const createdUsers = [];
  let createdRater = null;
  let createdFeedbackId = null;

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
            createdRater = body;
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
                    TEST_FEEDBACK.provider_id = body.id;
                  })
                  .end(() => feedbackController.createFeedback(TEST_FEEDBACK, createdRater)
                    .then((newFeedback) => {
                      createdFeedbackId = newFeedback.id;
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

  it('Get all provider feedbacks', (done) => {
    supertest
      .get(`/api/v1/users/${_.last(createdUsers).id}/provider/feedbacks`)
      .set('Content-Type', 'application/json')
      .expect(({ body }) => {
        expect(body).to.be.instanceof(Array);
        expect(body).to.have.length.of.at.least(1);
        expect(_.last(body).job_description).to.equal(TEST_FEEDBACK.job_description);
      })
      .end(done);
  });

  it('Get feedback by id and provider', (done) => {
    supertest
      .get(`/api/v1/users/${_.last(createdUsers).id}/provider/feedbacks/${createdFeedbackId}`)
      .set('Content-Type', 'application/json')
      .expect(({ body }) => {
        expect(body.job_description).to.equal(TEST_FEEDBACK.job_description);
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
