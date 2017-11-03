module.exports = function (sequelize, DataTypes) {
  const FeedbackRequestNotification = sequelize.define('FeedbackRequestNotification', {
    feedback_request_id: DataTypes.INTEGER,
    prev_feedback_request: DataTypes.JSON,
    is_viewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        FeedbackRequestNotification.belongsTo(models.FeedbackRequest, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true,
          },
        })
      },
    },
  });
  return FeedbackRequestNotification;
};
