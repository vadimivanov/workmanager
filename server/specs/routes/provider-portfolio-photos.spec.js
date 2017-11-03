const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;

const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [portfolioPhoto] = require('../../../config/database/seeds/PortfolioPhoto.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const PROVIDER = userRoles.PROVIDER;

const TEST_PROVIDER = Object.assign({},
  userProvider, {
    login: Date.now() + userProvider.login,
    email: Date.now() + userProvider.email,
  }
);

const TEST_PORTFOLIO_PHOTO = Object.assign({},
  portfolioPhoto, {
    description: Date.now() + portfolioPhoto.description,
  }
);

const NEW_FIELDS = {
  photo_simple_url: null,
  photo_before_url: 'https://okornok-uploads.s3.eu-central-1.amazonaws.com/test-image-1.jpg',
  photo_after_url: 'https://okornok-uploads.s3.eu-central-1.amazonaws.com/test-image-2.jpg',
  description: 'Type of work performed',
};

delete TEST_PORTFOLIO_PHOTO.provider_id;

describe('Testing of routes of provider portfolio photos', () => {
  let createdUserProvider = null;
  let authorizationToken = null;
  let createdPortfolioPhotoId = null;

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

  it('Create portfolio photo', (done) => {
    supertest
      .post(`/api/v1/users/${createdUserProvider.id}/provider/portfolio-photos`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(TEST_PORTFOLIO_PHOTO)
      .expect(({ body }) => {
        expect(body.message).to.equal(TEST_PORTFOLIO_PHOTO.message);
        createdPortfolioPhotoId = body.id;
      })
      .end(done);
  });

  it('Update portfolio photo', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserProvider.id}/provider/portfolio-photos/${createdPortfolioPhotoId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(NEW_FIELDS)
      .expect(({ body }) => {
        expect(body.description).to.equal(NEW_FIELDS.description);
        expect(body.photo_simple_url).to.equal(NEW_FIELDS.photo_simple_url);
        expect(body.photo_before_url).to.equal(NEW_FIELDS.photo_before_url);
        expect(body.photo_after_url).to.equal(NEW_FIELDS.photo_after_url);
      })
      .end(done);
  });

  it('Delete portfolio photo', (done) => {
    supertest
      .delete(`/api/v1/users/${createdUserProvider.id}/provider/portfolio-photos/${createdPortfolioPhotoId}`)
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
