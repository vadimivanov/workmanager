const StaffMember = require('../../../../config/database/seeds/StaffMember.seed.json');
const { addTimestamp } = require('../helpers');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('StaffMembers',
      StaffMember.map(addTimestamp(Sequelize))
      , {});
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('StaffMembers', null, {});
  },
};
