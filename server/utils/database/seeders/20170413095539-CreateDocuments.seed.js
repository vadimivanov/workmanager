const Documents = require('../../../../config/database/seeds/Documents.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Documents',
      Documents.map(addTimestamp(Sequelize)),
      {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Documents', null, {});
  },
};
