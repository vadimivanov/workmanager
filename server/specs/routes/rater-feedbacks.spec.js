const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;
const _ = require('lodash/fp');

const [userRater] = require('../../../config/database/seeds/Users.seed.json');
const [feedback] = require('../../../config/database/seeds/Feedbacks.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const RATER = userRoles.RATER;

const TEST_RATER = Object.assign({},
  userRater, {
    login: Date.now() + userRater.login,
    email: Date.now() + userRater.email,
  }
);

const TEST_FEEDBACK_1 = Object.assign({},
  feedback, {
    job_description: Date.now() + feedback.job_description,
    project_cost: [200, 400],
    replies: [{ id: 1, message: 'good feedback!' }],
  }
);

delete TEST_FEEDBACK_1.id;
delete TEST_FEEDBACK_1.rater_id;

const TEST_FEEDBACK_2 = Object.assign({},
  TEST_FEEDBACK_1, {
    job_description: 'New description',
  }
);

describe('Testing of routes of rater feedbacks', () => {
  let createdRater = null;
  let authorizationToken = null;
  let createdFeedback = null;

  before('Create rater and authorization', (done) => {
    supertest
      .post('/auth/sign-up/rater/')
      .set('Content-Type', 'application/json')
      .send(TEST_RATER)
      .expect(({ body }) => {
        expect(body.role).to.equal(RATER);
        createdRater = body;
      })
      .end(() => {
        supertest
          .post('/auth/sign-in/')
          .set('Content-Type', 'application/json')
          .send(TEST_RATER)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(({ body }) => {
            expect(body).to.not.null;
            authorizationToken = body.JWT;
          })
          .end(done);
      });
  });

  it('Create feedback', (done) => {
    supertest
      .post(`/api/v1/users/${createdRater.id}/rater/feedbacks`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(TEST_FEEDBACK_1)
      .expect(({ body }) => {
        expect(body.job_description).to.equal(TEST_FEEDBACK_1.job_description);
        createdFeedback = body;
      })
      .end(done);
  });

  it('Get all rater feedbacks', (done) => {
    supertest
      .get(`/api/v1/users/${createdRater.id}/rater/feedbacks`)
      .set('Content-Type', 'application/json')
      .expect(({ body }) => {
        expect(body).to.be.instanceof(Array);
        expect(body).to.have.length.of.at.least(1);
        expect(_.last(body).job_description).to.equal(TEST_FEEDBACK_1.job_description);
      })
      .end(done);
  });

  it('Update feedback by id and rater', (done) => {
    supertest
      .put(`/api/v1/users/${createdRater.id}/rater/feedbacks/${createdFeedback.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(TEST_FEEDBACK_2)
      .expect(({ body }) => {
        expect(body.job_description).to.equal(TEST_FEEDBACK_2.job_description);
      })
      .end(done);
  });

  it('Delete feedback by id and rater', (done) => {
    supertest
      .delete(`/api/v1/users/${createdRater.id}/rater/feedbacks/${createdFeedback.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .expect(({ body }) => {
        expect(body).to.be.empty;
      })
      .end(() => {
        supertest
          .get(`/api/v1/users/${createdRater.id}/rater/feedbacks/${createdFeedback.id}`)
          .set('Content-Type', 'application/json')
          .expect(({ body }) => {
            expect(body).to.be.empty;
          })
          .end(done);
      });
  });

  after('Delete user from db', (done) => {
    userUtils.deleteUser(createdRater)
      .then(() => done())
      .catch((err) => {
        console.log(err.message);
        expect(err).to.not.exist;
      })
  });
});
