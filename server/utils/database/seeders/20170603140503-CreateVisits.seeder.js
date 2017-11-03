const Visits = require('../../../../config/database/seeds/Visits.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Visits',
      Visits.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Visits', null, {});
  },
};
