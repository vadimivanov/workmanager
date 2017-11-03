module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('ProblemFeedbackReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reason: {
        type: Sequelize.ENUM('TODO'),
      },
      description: {
        type: Sequelize.TEXT,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
      },
      feedback_id: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('ProblemFeedbackReports');
  },
};
