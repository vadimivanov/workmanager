const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const serviceController = require('../../controllers/service-controller');
const repairService = require('../../../config/database/seeds/Services.seed.json')[0];

const TEST_SERVICE = Object.assign({},
  repairService, {
    name: Date.now() + repairService.name,
  }
);

delete TEST_SERVICE.id;

describe('Service controller', () => {
  let createdService = null;

  before('Create new service', async () => {
    try {
      await initialization;
      createdService = await serviceController.createService(TEST_SERVICE);

      expect(createdService.get('name')).to.equal(TEST_SERVICE.name);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get single service by ID', async () => {
    try {
      const singleService = await serviceController.getServiceById(createdService.get('id'));
      expect(singleService.get('name')).to.equal(TEST_SERVICE.name);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Replace single service by itself', async () => {
    try {
      const updatedService = await serviceController.updateService({ is_approved: true }, createdService.get('id'));
      expect(updatedService.get('name')).to.equal(TEST_SERVICE.name);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  after('Delete service', async () => {
    try {
      await serviceController.deleteServiceById(createdService.get('id'));
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
