const { viewStatistics } = require('../../../../config/database/enums/PlanLimitTypes.enum.json');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('PlanLimits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      billing_plan_id: {
        type: Sequelize.STRING
      },
      photos_before_after_limit: {
        type: Sequelize.INTEGER
      },
      photos_feedback_request_limit: {
        type: Sequelize.INTEGER
      },
      photos_simple_limit: {
        type: Sequelize.INTEGER
      },
      photos_inspiration_page_limit: {
        type: Sequelize.INTEGER
      },
      view_statistics: {
        type: Sequelize.ENUM(viewStatistics.NONE, viewStatistics.BASIC, viewStatistics.ADVANCED)
      },
      has_top_badge: {
        type: Sequelize.BOOLEAN
      },
      staff_members_enabled: {
        type: Sequelize.BOOLEAN
      },
      feedback_quotes_enabled: {
        type: Sequelize.BOOLEAN
      },
      general_news_enabled: {
        type: Sequelize.BOOLEAN
      },
      info_files_enabled: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('PlanLimits');
  }
};
