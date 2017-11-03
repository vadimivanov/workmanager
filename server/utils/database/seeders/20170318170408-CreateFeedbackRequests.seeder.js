const FeedbackRequests = require('../../../../config/database/seeds/FeedbackRequests.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('FeedbackRequests',
      FeedbackRequests.map(addTimestamp(Sequelize)),
      {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('FeedbackRequests', null, {});
  },
};
