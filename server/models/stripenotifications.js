module.exports = function (sequelize, DataTypes) {
  const StripeNotification = sequelize.define('StripeNotification', {
    stripe_notification_id: DataTypes.STRING,
    object: DataTypes.STRING,
    api_version: DataTypes.STRING,
    created: DataTypes.INTEGER,
    data: DataTypes.JSON,
    livemode: DataTypes.BOOLEAN,
    pending_webhooks: DataTypes.INTEGER,
    request: DataTypes.JSON,
    type: DataTypes.STRING,
  }, {
    underscored: true,
    classMethods: {
      associate(models) {
        //
      },
    },
  });
  return StripeNotification;
};
