module.exports = function (sequelize, DataTypes) {
  const Rater = sequelize.define('Rater', {
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    about: {
      type: DataTypes.TEXT,
    },
    occupation: {
      type: DataTypes.STRING,
    },
    photo_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The url address of photo in storage must be valid',
        },
      },
    },
    user_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        Rater.hasMany(models.Feedback);
        Rater.belongsTo(models.User, {
          constraints: true,
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
          hooks: true,
        });
      },
    },
  });
  return Rater;
};
