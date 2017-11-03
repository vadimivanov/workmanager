const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;

const [userRater] = require('../../../config/database/seeds/Users.seed.json');
const [firstRater] = require('../../../config/database/seeds/Raters.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const RATER = userRoles.RATER;

const TEST_RATER = Object.assign({},
  userRater, {
    login: Date.now() + userRater.login,
    email: Date.now() + userRater.email,
  }
);

const TEST_RATER_2 = {
  first_name: Date.now() + firstRater.first_name,
  last_name: Date.now() + firstRater.last_name,
};


describe('Testing of routes of rater update', () => {
  let createdUserRater = null;
  let authorizationToken = null;

  before('Create Rater', (done) => {
    supertest
      .post('/auth/sign-up/rater/')
      .set('Content-Type', 'application/json')
      .send(TEST_RATER)
      .expect(({ body }) => {
        expect(body.role).to.equal(RATER);
        createdUserRater = body;
      })
      .end(done);
  });

  it('Rater authorization', (done) => {
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

  it('Update some fields in rater with token', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserRater.id}/rater/`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(TEST_RATER_2)
      .expect(({ body }) => {
        expect(body.first_name).to.equal(TEST_RATER_2.first_name);
        expect(body.last_name).to.equal(TEST_RATER_2.last_name);
      })
      .end(done);
  });

  it('Update some fields in rater without token', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserRater.id}/rater/`)
      .set('Content-Type', 'application/json')
      .send(TEST_RATER_2)
      .expect((body) => {
        expect(body.text).to.equal('{"success":false}');
      })
      .end(done);
  });

  after('Delete user from db', (done) => {
    userUtils.deleteUser(createdUserRater)
        .then(() => done())
        .catch((err) => {
          console.log(err.message);
          expect(err).to.not.exist;
        })
  });
});
