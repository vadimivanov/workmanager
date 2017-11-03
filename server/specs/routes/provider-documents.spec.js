const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;

const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [document] = require('../../../config/database/seeds/Documents.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const PROVIDER = userRoles.PROVIDER;

const TEST_PROVIDER = Object.assign({},
  userProvider, {
    login: Date.now() + userProvider.login,
    email: Date.now() + userProvider.email,
  }
);

const TEST_DOCUMENT = Object.assign({},
  document, {
    name: Date.now() + document.name,
  }
);

const NEW_FIELDS = {
  name: 'New Name',
  file_url: 'https://okornok-uploads.s3.eu-central-1.amazonaws.com/test-document-2.jpg',
};

delete TEST_DOCUMENT.provider_id;

describe('Testing of routes of provider documents', () => {
  let createdUserProvider = null;
  let authorizationToken = null;
  let createdDocumentId = null;

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

  it('Create document', (done) => {
    supertest
      .post(`/api/v1/users/${createdUserProvider.id}/provider/documents`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(TEST_DOCUMENT)
      .expect(({ body }) => {
        expect(body.name).to.equal(TEST_DOCUMENT.name);
        createdDocumentId = body.id;
      })
      .end(done);
  });

  it('Update document', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserProvider.id}/provider/documents/${createdDocumentId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(NEW_FIELDS)
      .expect(({ body }) => {
        expect(body.name).to.equal(NEW_FIELDS.name);
        expect(body.file_url).to.equal(NEW_FIELDS.file_url);
      })
      .end(done);
  });

  it('Delete document', (done) => {
    supertest
      .delete(`/api/v1/users/${createdUserProvider.id}/provider/documents/${createdDocumentId}`)
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
