module.exports = function (sequelize, DataTypes) {
  const FeedbackNotification = sequelize.define('FeedbackNotification', {
    feedback_id: DataTypes.INTEGER,
    prev_feedback: DataTypes.JSON,
    is_viewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        FeedbackNotification.belongsTo(models.Feedback, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true,
          },
        });
      },
    },
  });
  return FeedbackNotification;
};
