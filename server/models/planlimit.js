const { viewStatistics } = require('../../config/database/enums/PlanLimitTypes.enum.json');

module.exports = function (sequelize, DataTypes) {
  const PlanLimit = sequelize.define('PlanLimit', {
    billing_plan_id: DataTypes.STRING,
    photos_feedback_request_limit: DataTypes.INTEGER,
    photos_before_after_limit: DataTypes.INTEGER,
    photos_simple_limit: DataTypes.INTEGER,
    photos_inspiration_page_limit: DataTypes.INTEGER,
    view_statistics: DataTypes.ENUM(viewStatistics.NONE, viewStatistics.BASIC, viewStatistics.ADVANCED),
    has_top_badge: DataTypes.BOOLEAN,
    staff_members_enabled: DataTypes.BOOLEAN,
    upload_pictures_to_a_rating: DataTypes.INTEGER,
    search_rating: DataTypes.INTEGER,
    general_news_enabled: DataTypes.BOOLEAN,
    info_files_enabled: DataTypes.BOOLEAN,
    feedback_quotes_enabled: DataTypes.BOOLEAN,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        //
      },
    },
  });
  return PlanLimit;
};
