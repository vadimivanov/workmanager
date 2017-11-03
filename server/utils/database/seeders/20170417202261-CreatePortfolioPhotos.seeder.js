const PortfolioPhotos = require('../../../../config/database/seeds/PortfolioPhoto.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PortfolioPhotos',
      PortfolioPhotos.map(addTimestamp(Sequelize)),
      {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PortfolioPhotos', null, {});
  },
};
