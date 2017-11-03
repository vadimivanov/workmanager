const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const _ = require('lodash/fp');

const initialization = require('../../../initialization/postgres-connect.initialization');
const ProviderSearchController = require('../../../controllers/provider/provider-search-controller');
const providerController = require('../../../controllers/provider/provider-controller');
const { User, Provider, Service, Subservice, sequelize } = require('../../../models');
const providersSeed = require('../../../../config/database/seeds/Providers.seed.json');
const servicesSeed = require('../../../../config/database/seeds/Services.seed.json');
const subServicesSeed = require('../../../../config/database/seeds/Subservices.seed.json');

describe('Providers search', () => {
  before('', async () => {
    try {
      await initialization;
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  xit('Search for providers by locations', async () => {
    try {
      const result = await User.findAll({
        where: sequelize.and(sequelize.or(
          sequelize.fn('LIKE', sequelize.col('Provider.company_name'), '%%'),
          sequelize.fn('LIKE', sequelize.col('Provider.Subservices.name'), '%%'),
          sequelize.fn('LIKE', sequelize.fn('array_to_string', sequelize.col('Provider.Subservices.metatags'), ',', '*'), '%%'),
          sequelize.fn('LIKE', sequelize.col('Provider.Subservices.Service.name'), '%%'),
          sequelize.fn('LIKE', sequelize.fn('array_to_string', sequelize.col('Provider.Subservices.Service.metatags'), ',', '*'), '%%'),
          ), sequelize.where(
          sequelize.fn('ST_DWithin',
            sequelize.col('Provider.locations'),
            sequelize.fn('ST_MakePoint', 47.420111, 9.385172),
            10),
          true),
        ),
        include: [{
          model: Provider,
          include: [{
            model: Subservice,
            through: 'ProviderSubservice',
            include: [{
              model: Service,
            }],
          }],
        }],
        order: [[sequelize.json('stripe_subscription.plan.id'), 'DESC'], [sequelize.col('Provider.rating'), 'DESC']],
      });

      console.log(JSON.stringify(result, null, 4))
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('without any criteria', async () => {
    try {
      const providers = await ProviderSearchController.findUserProviderBy({});
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('by Providers company_name', async () => {
    try {
      const [userProvider] = await ProviderSearchController.findUserProviderBy({ searchText: 'Basic provider' });
      expect(userProvider.Provider.company_name).to.be.equal(_.first(providersSeed).company_name);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('by Providers Service name', async () => {
    try {
      const [userProvider] = await ProviderSearchController.findUserProviderBy({ serviceName: 'Decken- und Wandbekleidungen' });
      expect(_.first(userProvider.Provider.Subservices).Service.name).to.be.equal(servicesSeed[4].name);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('by Providers Subservice name', async () => {
    try {
      const [userProvider] = await ProviderSearchController.findUserProviderBy({ subserviceName: 'Platten-und Kunststoffbeläge' });
      expect(_.first(userProvider.Provider.Subservices).name).to.be.equal(subServicesSeed[55].name);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('by Providers location and distance', async () => {
    try {
      const usersProviders = await ProviderSearchController.findUserProviderBy({ lng: '8.518166', lat: '47.372852', distance: 400 });
      expect(usersProviders).to.have.lengthOf(1);
      expect(_.first(usersProviders).Provider.id).to.be.equal(_.last(providersSeed).id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('by Providers rating from to', async () => {
    try {
      const copiedProviders = providersSeed.slice();
      await Promise.all(copiedProviders.map(({ rating, user_id }) => { return providerController.updateProviderByUserId({ rating }, user_id) }));
      const [userProvider] = await ProviderSearchController.findUserProviderBy({ minRating: '4', maxRating: '4.5' });
      expect(userProvider.Provider.id).to.be.equal(_.last(providersSeed).id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  describe('by text occurrence', () => {
    it('in name of Service', async () => {
      try {
        const [userProvider] = await ProviderSearchController.findUserProviderBy({ searchText: 'Wandbekleidungen' });
        expect(_.first(userProvider.Provider.Subservices).Service.name).to.be.equal(servicesSeed[4].name);
      } catch (e) {
        console.log(JSON.stringify(e, null, 4));
        expect(e).to.not.exist;
      }
    });

    it('in metatags of Service', async () => {
      try {
        const [userProvider] = await ProviderSearchController.findUserProviderBy({ searchText: 'abspitzen' });
        expect(_.first(userProvider.Provider.Subservices).Service.name).to.be.equal(servicesSeed[1].name);
      } catch (e) {
        console.log(JSON.stringify(e, null, 4));
        expect(e).to.not.exist;
      }
    });

    it('in name of Subservice', async () => {
      try {
        const [userProvider] = await ProviderSearchController.findUserProviderBy({ searchText: 'Kunststoffbeläge' });
        expect(_.first(userProvider.Provider.Subservices).name).to.be.equal(subServicesSeed[55].name);
      } catch (e) {
        console.log(JSON.stringify(e, null, 4));
        expect(e).to.not.exist;
      }
    });

    it('in metatags of Subservice', async () => {
      try {
        const [userProvider] = await ProviderSearchController.findUserProviderBy({ searchText: 'instandsetzen' });
        expect(_.first(userProvider.Provider.Subservices).name).to.be.equal(subServicesSeed[6].name);
      } catch (e) {
        console.log(JSON.stringify(e, null, 4));
        expect(e).to.not.exist;
      }
    });
  });

  it('and sorting by prometed firstly and rating secondary', async () => {
    try {
      const userProvidersSortByRating = await ProviderSearchController.findUserProviderBy({ isSortByRatingOnly: 'true' });
      expect(_.first(userProvidersSortByRating).Provider.id).to.be.equal(_.first(providersSeed).id);
      const userProvidersSortNotByRating = await ProviderSearchController.findUserProviderBy({ isSortByRatingOnly: 'false' });
      expect(_.first(userProvidersSortNotByRating).Provider.id).to.be.equal(_.last(providersSeed).id);
      const userProvidersSortNotByRating2 = await ProviderSearchController.findUserProviderBy({});
      expect(_.first(userProvidersSortNotByRating2).Provider.id).to.be.equal(_.last(providersSeed).id);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
