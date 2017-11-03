const Feedbacks = require('../../../../config/database/seeds/Feedbacks.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Feedbacks',
      Feedbacks.map(addTimestamp(Sequelize)),
      {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Feedbacks', null, {});
  },
};
