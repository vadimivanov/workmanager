module.exports = function (sequelize, DataTypes) {
  const ProblemFeedbackReport = sequelize.define('ProblemFeedbackReport', {
    reason: DataTypes.ENUM('TODO'),
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reason_reject: {
      type: DataTypes.TEXT,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
    },
    feedback_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_viewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        ProblemFeedbackReport.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
        ProblemFeedbackReport.belongsTo(models.Feedback, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
      },
    },
  });
  return ProblemFeedbackReport;
};
