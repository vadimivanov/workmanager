module.exports = function (sequelize, DataTypes) {
  const NotificationSettingsList = sequelize.define('NotificationSettingsList', {
    email_for_notifications: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email address must be valid',
        },
      },
    },
    is_feedbacks_notify: DataTypes.BOOLEAN,
    is_feedbacks_request_notify: DataTypes.BOOLEAN,
    is_news_notify: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    user_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        NotificationSettingsList.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        })
      },
    },
  });
  return NotificationSettingsList;
};
