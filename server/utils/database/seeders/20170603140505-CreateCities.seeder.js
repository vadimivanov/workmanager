const { addTimestamp, createZipCitiesFromFile } = require('../helpers');
const zipCities = require('../../../../config/database/city_mapping.json');

const { cities } = createZipCitiesFromFile(zipCities);

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cities',
      cities.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Cities', null, {});
  },
};
