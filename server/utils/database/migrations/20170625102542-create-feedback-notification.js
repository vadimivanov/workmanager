module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('FeedbackNotifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      feedback_id: {
        type: Sequelize.INTEGER,
      },
      prev_feedback: {
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
    return queryInterface.dropTable('FeedbackNotifications');
  },
};
