const UserRoles = require('../../../../config/database/enums/UserRoles.enum.json');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      login: {
        type: Sequelize.STRING,
      },
      password_hash: Sequelize.STRING,
      password: {
        type: Sequelize.VIRTUAL,
      },
      email: {
        type: Sequelize.STRING,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
      },
      is_enabled: {
        type: Sequelize.BOOLEAN,
      },
      is_self_registered: {
        type: Sequelize.BOOLEAN,
      },
      last_online: {
        type: Sequelize.DATE,
      },
      role: {
        type: Sequelize.ENUM(UserRoles.RATER, UserRoles.PROVIDER, UserRoles.SUPPORTER, UserRoles.ADMIN),
      },
      stripe_account_id: {
        type: Sequelize.STRING,
      },
      stripe_subscription: {
        type: Sequelize.JSON,
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
    return queryInterface.dropTable('Users');
  },
};
