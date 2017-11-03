const InspirationCategory = require('../../../../config/database/seeds/InspirationCategory.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('InspirationCategories',
      InspirationCategory.map(addTimestamp(Sequelize)),
      {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('InspirationCategories', null, {});
  },
};
