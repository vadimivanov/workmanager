const NotificationTypes = require('../../config/database/enums/NotificationTypes.enum.json');

module.exports = function (sequelize, DataTypes) {
  const Notification = sequelize.define('Notification', {
    type: DataTypes.ENUM(NotificationTypes.CREATED, NotificationTypes.UPDATED, NotificationTypes.DELETED),
    subject_current_state: DataTypes.JSON,
    subject_prev_state: DataTypes.JSON,
    subject_name: DataTypes.STRING,
    subject_id: DataTypes.INTEGER,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return Notification;
};
