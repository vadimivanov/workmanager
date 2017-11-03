const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const locationController = require('../../controllers/location-controller');
const [location] = require('../../../config/database/seeds/Locations.seed.json');
const [firstProvider] = require('../../../config/database/seeds/Providers.seed.json');

const TEST_LOCATION1 = Object.assign({},
  location, {
    name: Date.now() + location.name,
  }
);

delete TEST_LOCATION1.provider_id;

const TEST_LOCATION2 = Object.assign({},
  TEST_LOCATION1, {
    name: Date.now() + TEST_LOCATION1.name,
  }
);

describe('Location controller', () => {
  let createdLocations = null;

  before('Create new locations', async () => {
    try {
      await initialization;
      createdLocations = await locationController.setLocationsToProvider([TEST_LOCATION1, TEST_LOCATION2], firstProvider);
      expect(createdLocations[0].get('name')).to.equal(TEST_LOCATION1.name);
      expect(createdLocations[1].get('name')).to.equal(TEST_LOCATION2.name);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get all locations by provider', async () => {
    try {
      const allLocations = await locationController.getLocationsByProvider(firstProvider);
      expect(allLocations).to.be.instanceof(Array);
      expect(allLocations).to.have.length.of.at.least(2);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  after('Delete locations', async () => {
    try {
      await Promise.all(createdLocations.map((getedLocation) => { return locationController._deleteLocation(getedLocation.id) }));
    } catch (e) {
      console.log(e.message);
      expect(e).to.not.exist;
    }
  });
});
