const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization.js');
const visitController = require('../../controllers/visit-controller');
const [firstProvider] = require('../../../config/database/seeds/Providers.seed.json');
const [testVisit] = require('../../../config/database/seeds/Visits.seed.json');

describe('Visit controller', () => {
  let createdVisit = null;

  before('Create new visit', async () => {
    try {
      await initialization;
      createdVisit = await visitController.createVisit(testVisit, firstProvider);
      expect(createdVisit.provider_id).to.equal(firstProvider.id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Created visit should exists', async () => {
    try {
      const providerVisits = await visitController.getAllVisitsByProvider(firstProvider);
      expect(providerVisits
          .some(visit => visit.id === createdVisit.id)
        ).to.be.true;
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  after('Delete test visit', async () => {
    try {
      await visitController._deleteVisitById(createdVisit.id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
