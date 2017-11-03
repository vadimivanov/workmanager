module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('NotificationSettingsLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email_for_notifications: {
        type: Sequelize.STRING,
      },
      is_feedbacks_notify: {
        type: Sequelize.BOOLEAN,
      },
      is_news_notify: {
        type: Sequelize.BOOLEAN,
      },
      user_id: {
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
    return queryInterface.dropTable('NotificationSettingsLists');
  },
};
