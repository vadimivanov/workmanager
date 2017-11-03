const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization.js');
const zipCityController = require('../../controllers/zip-city-controller');

describe('Zip codes, Cities controller', () => {
  before('Initialization', async () => {
    try {
      await initialization;
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get all zip codes', async () => {
    try {
      await zipCityController.getAllZipCodes({});
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get zip codes by zip/city part', async () => {
    try {
      await zipCityController.getAllZipCodes({ zipPart: '890' });
      await zipCityController.getAllZipCodes({ cityPart: 'A' });
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Get all cities', async () => {
    try {
      await zipCityController.getAllCities({});
    } catch (e) {
      expect(e).to.not.exist;
    }
  });

  it('Get city by zip/city part', async () => {
    try {
      await zipCityController.getAllCities({ zipPart: '890' });
      await zipCityController.getAllCities({ cityPart: 'Ae' });
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
