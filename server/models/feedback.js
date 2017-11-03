module.exports = function (sequelize, DataTypes) {
  const Feedback = sequelize.define('Feedback', {
    project_cost: {
      type: DataTypes.RANGE(DataTypes.INTEGER),
    },
    is_price_confidential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quoted_job_description: {
      type: DataTypes.TEXT,
    },
    quality_of_work: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    quality_of_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    quality_of_friendliness: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    quality_of_timeschedule: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    is_displaying: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_displaying_quote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_approved: DataTypes.BOOLEAN,
    photo_urls: DataTypes.ARRAY(DataTypes.STRING),
    likes: DataTypes.ARRAY(DataTypes.INTEGER),
    replies: DataTypes.JSON,
    provider_email: {
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
        Feedback.hasMany(models.ProblemFeedbackReport);
        Feedback.hasMany(models.FeedbackNotification);
        Feedback.belongsTo(models.Rater, {
          onDelete: 'SET NULL',
          foreignKey: {
            allowNull: true,
          },
        });
        Feedback.belongsTo(models.Provider, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true,
          },
        });
        Feedback.belongsTo(models.Service);
      },
    },
  });
  return Feedback;
};
