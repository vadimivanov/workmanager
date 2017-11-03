const Providers = require('../../../../config/database/seeds/Providers.seed.json');
const { addTimestamp, addYear } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Providers',
      Providers
        .map(addTimestamp(Sequelize))
        .map(addYear(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Providers', null, {});
  },
};
