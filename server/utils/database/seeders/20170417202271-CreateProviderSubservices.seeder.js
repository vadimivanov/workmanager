const ProviderSubservice = require('../../../../config/database/seeds/ProviderSubservices.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ProviderSubservice',
      ProviderSubservice.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ProviderSubservice', null, {});
  },
};
