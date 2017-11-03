const app = require('../../app');
const supertest = require('supertest')(app);
const { describe, it, before, after } = require('mocha');
const expect = require('chai').expect;

const userUtils = require('../helpers/user-management.helper');
const stripeConfig = require('../../../config/stripe.config.json');
const stripe = require('stripe')(stripeConfig.apiTestKeys.secretKey);

const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const billingPlans = require('../../../config/database/enums/StripeBillingPlans.enum.json');

const TEST_PROVIDER = Object.assign({},
  userProvider, {
    login: Date.now() + userProvider.login,
    email: Date.now() + userProvider.email,
  }
);

const bindCardInStripe = ({ stripe_account_id }) => (new Promise((resolve, reject) => {
  stripe.customers.createSource(
    stripe_account_id,
    { source: 'tok_ch' },
    (err, card) => {
      if (err) return reject(err);
      return resolve(card);
    }
  );
}));

describe('Testing of routes of provider subscription', () => {
  let createdUserProvider = null;
  let authorizationToken = null;

  before('Create provider and authorization', (done) => {
    supertest
      .post('/auth/sign-up/provider/')
      .set('Content-Type', 'application/json')
      .send(TEST_PROVIDER)
      .expect(({ body }) => {
        expect(body).to.not.empty;
        expect(body.stripe_subscription.plan.id).to.be.equal(billingPlans.BASIC);
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
          .end(() => bindCardInStripe(createdUserProvider)
            .then(() => { return done() }));
      })
  });

  it('Subscribe provider on another billing plan', (done) => {
    supertest
      .put(`/api/v1/users/${createdUserProvider.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationToken)
      .send({ plan_id: billingPlans.SILVER })
      .expect(({ body }) => {
        expect(body).to.not.empty;
        expect(body.stripe_subscription.plan.id).to.be.equal(billingPlans.SILVER);
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
