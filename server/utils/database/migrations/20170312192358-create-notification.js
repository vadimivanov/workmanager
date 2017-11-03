const NotificationTypes = require('../../../../config/database/enums/NotificationTypes.enum.json');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM(NotificationTypes.CREATED, NotificationTypes.UPDATED, NotificationTypes.DELETED),
      },
      subject_current_state: {
        type: Sequelize.JSON,
      },
      subject_prev_state: {
        type: Sequelize.JSON,
      },
      subject_name: {
        type: Sequelize.STRING,
      },
      subject_id: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Notifications');
  },
};
