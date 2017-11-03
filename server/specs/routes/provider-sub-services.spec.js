const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;
const _ = require('lodash/fp');

const subServiceController = require('../../controllers/subservice-controller');
const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [firstSubServices, secondSubServices] = require('../../../config/database/seeds/Subservices.seed.json');
const userRoles = require('../../../config/database/enums/UserRoles.enum.json');

const userUtils = require('../helpers/user-management.helper');

const PROVIDER = userRoles.PROVIDER;

const TEST_PROVIDER = Object.assign({},
  userProvider, {
    login: Date.now() + userProvider.login,
    email: Date.now() + userProvider.email,
  }
);

const TEST_SUBSERVICE_1 = Object.assign({},
  firstSubServices, {
    name: Date.now() + firstSubServices.name,
  }
);

const TEST_SUBSERVICE_2 = Object.assign({},
  secondSubServices, {
    name: Date.now() + secondSubServices.name,
  }
);

const SUBSERVICES = [TEST_SUBSERVICE_1, TEST_SUBSERVICE_2];

describe('Testing of routes of provider subservices', () => {
  let createdUserProvider = null;
  let authorizationToken = null;

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
          .end(() => {
            subServiceController.createSubService(TEST_SUBSERVICE_1)
              .then((newSubservice1) => {
                TEST_SUBSERVICE_1.id = newSubservice1.id;
                subServiceController.createSubService(TEST_SUBSERVICE_2)
                  .then((newSubservice2) => {
                    TEST_SUBSERVICE_2.id = newSubservice2.id;
                    done();
                  })
              })
              .catch((err) => {
                console.log(err.message);
                expect(err).to.not.exist;
              })
          });
      })
  });

  it('Bind subservices to provider', (done) => {
    supertest
      .post(`/api/v1/users/${createdUserProvider.id}/provider/subservices`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send(SUBSERVICES)
      .expect(({ body }) => {
        expect(body).to.be.instanceof(Array);
        expect(body.length).to.equal(2);
        expect(_.last(body).subservice_id).to.equal(TEST_SUBSERVICE_2.id);
      })
      .end(done);
  });

  it('Delete bind subservice to provider', (done) => {
    supertest
      .delete(`/api/v1/users/${createdUserProvider.id}/provider/subservices/${TEST_SUBSERVICE_2.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .expect(({ body }) => {
        expect(body).to.be.empty;
      })
      .end(() => {
        supertest
          .get(`/api/v1/users/${createdUserProvider.id}/provider/subservices/`)
          .set('Content-Type', 'application/json')
          .expect(({ body }) => {
            expect(body).to.be.instanceof(Array);
            expect(body).to.have.length.of.at.least(1);
            expect(_.last(body).id).to.equal(TEST_SUBSERVICE_1.id)
          })
          .end(done);
      });
  });

  after('Delete provider and subservice from db', (done) => {
    subServiceController.deleteSubServiceById(TEST_SUBSERVICE_1.id)
      .then(() => subServiceController.deleteSubServiceById(TEST_SUBSERVICE_2.id)
          .then(() => userUtils.deleteUser(createdUserProvider)
            .then(() => done()))
      )
      .catch((err) => {
        console.log(err.message);
        expect(err).to.not.exist;
      })
  });
});
