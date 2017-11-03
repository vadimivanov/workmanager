const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const planLimitController = require('../../controllers/plan-limit-controller');
const [testUser] = require('../../../config/database/seeds/Users.seed.json');

describe('Plan limit controller', () => {
  before('Create new service', async () => {
    try {
      await initialization;
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get all plan limits', async () => {
    try {
      const planLimits = await planLimitController.getAllPlanLimits();
      expect(planLimits).to.be.not.empty;
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get plan limit by user', async () => {
    try {
      const planLimit = await planLimitController.getPlanLimitByUser(testUser);
      expect(planLimit).to.be.not.empty;
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
