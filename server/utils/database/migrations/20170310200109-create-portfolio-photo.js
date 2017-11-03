module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('PortfolioPhotos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      photo_simple_url: {
        type: Sequelize.STRING,
      },
      photo_before_url: {
        type: Sequelize.STRING,
      },
      photo_after_url: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
      },
      is_visible: {
        type: Sequelize.BOOLEAN,
      },
      is_idea_for_inspiration: {
        type: Sequelize.BOOLEAN,
      },
      provider_id: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('PortfolioPhotos');
  },
};
