const Services = require('../../../../config/database/seeds/Services.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Services',
      Services.map(addTimestamp(Sequelize))
      , {})
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Services', null, {});
  },
};
