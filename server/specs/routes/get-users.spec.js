const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;
const _ = require('lodash/fp');

const [userRater, userProvider] = require('../../../config/database/seeds/Users.seed.json');
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

describe('Testing of routes of users', () => {
  const createdUsers = [];

  before('Create users', (done) => {
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
          .post('/auth/sign-up/provider/')
          .set('Content-Type', 'application/json')
          .send(TEST_PROVIDER)
          .expect(({ body }) => {
            expect(body.role).to.equal(PROVIDER);
            createdUsers.push(body);
          })
          .end(done);
      });
  });

  it('Get all users', (done) => {
    supertest
      .get('/api/v1/users')
      .set('Content-Type', 'application/json')
      .expect(({ body }) => {
        expect(body).to.be.instanceof(Array);
        expect(body).to.have.length.of.at.least(2);
        expect(_.last(body).role).to.equal(PROVIDER);
      })
      .end(done);
  });

  it('Get one user', (done) => {
    supertest
      .get(`/api/v1/users/${_.first(createdUsers).id}`)
      .set('Content-Type', 'application/json')
      .expect(({ body }) => {
        expect(body.role).to.equal(RATER);
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
