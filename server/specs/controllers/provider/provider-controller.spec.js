const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const _ = require('lodash/fp');

const initialization = require('../../../initialization/postgres-connect.initialization');
const providerController = require('../../../controllers/provider/provider-controller');
const userUtils = require('../../helpers/user-management.helper');
const [, userProvider] = require('../../../../config/database/seeds/Users.seed.json');
const [testProvider] = require('../../../../config/database/seeds/Providers.seed.json');

describe('Provider controller', () => {
  let createdUser = null;

  before('Create new user provider', async () => {
    try {
      await initialization;
      createdUser = await userUtils.createUniqueUserProvider(userProvider, testProvider);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Replace single user-provider by himself', async () => {
    try {
      const updatedProvider = (await providerController.updateProviderByUserId(createdUser.Provider, createdUser.id));
      expect(updatedProvider.name).to.equal(testProvider.name);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Set single subservice to provider', async () => {
    try {
      const testSubservice = { id: 1 };
      const [providerSubservice] = await providerController.setSubServiceToProvider(createdUser.Provider, testSubservice);
      expect(createdUser.Provider.id).to.equal(providerSubservice.provider_id);
      expect(testSubservice.id).to.equal(providerSubservice.subservice_id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Set multiple subservices to provider', async () => {
    try {
      const testSubservices = [{ id: 2 }, { id: 3 }];
      const result = await providerController.setSubServicesToProvider(createdUser.Provider, testSubservices);
      expect(_.map('subservice_id', result)).to.eql(_.map('id', testSubservices));
      //console.log(JSON.stringify(_.map('subservice_id', result, null, 4)))
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Recalculate all providers rating', async () => {
    try {
      const updatedProviders = await providerController.recalculateAllProvidersRating();
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  after('Delete user', async () => {
    try {
      await userUtils.deleteUser(createdUser);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
