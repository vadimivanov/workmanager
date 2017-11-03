module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('PortfolioPhotoNotifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      portfolio_photo_id: {
        type: Sequelize.INTEGER,
      },
      prev_portfoliophoto: {
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
    return queryInterface.dropTable('PortfolioPhotoNotifications');
  },
};
