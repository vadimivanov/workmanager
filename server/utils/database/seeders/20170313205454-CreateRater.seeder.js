const Raters = require('../../../../config/database/seeds/Raters.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Raters',
      Raters.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Raters', null, {});
  },
};
