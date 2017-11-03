const NotificationSetingsLists = require('../../../../config/database/seeds/NotificationSetingsLists.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('NotificationSettingsLists',
      NotificationSetingsLists.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('NotificationSettingsLists', null, {});
  },
};
