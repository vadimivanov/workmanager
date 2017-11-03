const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const serviceController = require('../../controllers/service-controller');
const subServiceController = require('../../controllers/subservice-controller');
const repairService = require('../../../config/database/seeds/Services.seed.json')[0];
const firstSubservice = require('../../../config/database/seeds/Subservices.seed.json')[0];

const TEST_SERVICE = Object.assign({},
  repairService, {
    name: Date.now() + repairService.name,
  }
);

delete TEST_SERVICE.id;

const TEST_SUBSERVICE = Object.assign({},
  firstSubservice, {
    name: Date.now() + firstSubservice.name,
  }
);

delete TEST_SUBSERVICE.id;

describe('Sub service controller', () => {
  let createdService = null;
  let createdSubservice = null;

  before('Create new sub service', async () => {
    try {
      await initialization;
      createdService = await serviceController.createService(TEST_SERVICE);
      TEST_SUBSERVICE.service_id = createdService.get('id');
      createdSubservice = await subServiceController.createSubService(TEST_SUBSERVICE);

      expect(createdService.get('name')).to.equal(TEST_SERVICE.name);
      expect(createdSubservice.get('name')).to.equal(TEST_SUBSERVICE.name);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get single sub service by ID', async () => {
    try {
      const singleSubservice = await subServiceController.getSubServiceById(createdSubservice.get('id'));
      expect(singleSubservice.get('name')).to.equal(TEST_SUBSERVICE.name);
      expect(singleSubservice.Service.get('name')).to.equal(TEST_SERVICE.name);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Replace single sub service by itself', async () => {
    try {
      const updatedSubservice = await subServiceController.updateSubService({ is_approved: true }, createdSubservice.get('id'));
      expect(updatedSubservice.get('name')).to.equal(TEST_SUBSERVICE.name);
      expect(updatedSubservice.get('is_approved')).to.be.true;
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  after('Delete sub service', async () => {
    try {
      await serviceController.deleteServiceById(createdService.get('id'));
      await subServiceController.deleteSubServiceById(createdSubservice.get('id'));
    } catch (e) {
      console.log(e.message);
      expect(e).to.not.exist;
    }
  });
});
