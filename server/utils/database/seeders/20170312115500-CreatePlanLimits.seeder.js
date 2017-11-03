const PlanLimits = require('../../../../config/database/seeds/PlanLimits.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PlanLimits',
      PlanLimits
        .map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PlanLimits', null, {});
  },
};
