const Locations = require('../../../../config/database/seeds/Locations.seed.json');
const { addTimestamp, addGeometryPoint } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Locations',
      Locations
        .map(addTimestamp(Sequelize))
        .map(addGeometryPoint(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Locations', null, {});
  },
};
