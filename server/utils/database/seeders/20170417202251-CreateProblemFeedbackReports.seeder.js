const problemFeedbackReports = require('../../../../config/database/seeds/ProblemFeedbackReports.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ProblemFeedbackReports',
      problemFeedbackReports.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ProblemFeedbackReports', null, {});
  },
};
