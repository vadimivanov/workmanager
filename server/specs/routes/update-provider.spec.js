const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;

const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [first] = require('../../../config/database/seeds/Providers.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const PROVIDER = userRoles.PROVIDER;

const TEST_PROVIDER = Object.assign({},
  userProvider, {
    login: Date.now() + userProvider.login,
    email: Date.now() + userProvider.email,
  }
);

const TEST_PROVIDER_2 = {
  company_name: Date.now() + first.company_name,
  about: Date.now() + first.about,
};

describe('Testing of routes of provider update', () => {
  let createdUserProvider = null;
  let authorizationToken = null;

  before('Create Provider', (done) => {
    supertest
      .post('/auth/sign-up/provider/')
      .set('Content-Type', 'application/json')
      .send(TEST_PROVIDER)
      .expect(({ body }) => {
        expect(body.role).to.equal(PROVIDER);
        createdUserProvider = body;
      })
      .end(done);
  });

  it('Provider authorization', (done) => {
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
  });

  it('Update some fields in provider with token', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserProvider.id}/provider/`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(TEST_PROVIDER_2)
      .expect(({ body }) => {
        expect(body.company_name).to.equal(TEST_PROVIDER_2.company_name);
        expect(body.about).to.equal(TEST_PROVIDER_2.about);
      })
      .end(done);
  });

  it('Update some fields in provider without token', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserProvider.id}/provider/`)
      .set('Content-Type', 'application/json')
      .send(TEST_PROVIDER_2)
      .expect((body) => {
        expect(body.text).to.equal('{"success":false}');
      })
      .end(done);
  });

  after('Delete user from db', (done) => {
    userUtils.deleteUser(createdUserProvider)
      .then(() => done())
      .catch((err) => {
        console.log(err.message);
        expect(err).to.not.exist;
      })
  });
});
