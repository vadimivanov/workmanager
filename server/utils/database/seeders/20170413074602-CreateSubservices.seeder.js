const Subservices = require('../../../../config/database/seeds/Subservices.seed.json');
const { addTimestamp, setIndexThroughArrayIndex } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Subservices',
      Subservices
        .map(addTimestamp(Sequelize))
        .map(setIndexThroughArrayIndex)
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Subservices', null, {});
  },
};
