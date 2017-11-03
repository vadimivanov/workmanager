module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('StripeNotifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      stripe_notification_id: {
        type: Sequelize.STRING,
      },
      object: {
        type: Sequelize.STRING,
      },
      api_version: {
        type: Sequelize.STRING,
      },
      created: {
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.JSON,
      },
      livemode: {
        type: Sequelize.BOOLEAN,
      },
      pending_webhooks: {
        type: Sequelize.INTEGER,
      },
      request: {
        type: Sequelize.JSON,
      },
      type: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('StripeNotifications');
  },
};
