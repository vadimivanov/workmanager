module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('FeedbackRequestNotifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      feedback_request_id: {
        type: Sequelize.INTEGER,
      },
      prev_feedback_request: {
        type: Sequelize.JSON,
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
    return queryInterface.dropTable('FeedbackRequestNotifications');
  },
};
