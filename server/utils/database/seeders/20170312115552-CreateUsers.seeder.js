const Users = require('../../../../config/database/seeds/Users.seed.json');
const { addTimestamp, setPasswordHashAndDeletePassword } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users',
      Users
        .map(addTimestamp(Sequelize))
        .map(setPasswordHashAndDeletePassword)
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
