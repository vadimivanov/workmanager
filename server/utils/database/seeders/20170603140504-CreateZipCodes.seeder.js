const { addTimestamp, createZipCitiesFromFile } = require('../helpers');
const zipCities = require('../../../../config/database/city_mapping.json');

const { zipCodes } = createZipCitiesFromFile(zipCities);

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ZipCodes',
      zipCodes.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ZipCodes', null, {});
  },
};
