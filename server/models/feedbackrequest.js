module.exports = function (sequelize, DataTypes) {
  const FeedbackRequest = sequelize.define('FeedbackRequest', {
    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo_urls: DataTypes.ARRAY(DataTypes.STRING),
    rater_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Email address must be valid',
        },
      },
    },
    rater_id: DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        FeedbackRequest.hasMany(models.FeedbackRequestNotification);
        FeedbackRequest.belongsTo(models.Service);
        FeedbackRequest.belongsTo(models.Provider, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
        FeedbackRequest.belongsTo(models.Rater, {
          onDelete: 'SET NULL',
          foreignKey: {
            allowNull: true,
          },
        });
      },
    },
  });
  return FeedbackRequest;
};
