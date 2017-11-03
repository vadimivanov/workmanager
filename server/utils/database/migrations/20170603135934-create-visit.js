module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Visits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      service: {
        type: Sequelize.STRING,
      },
      location_coordinates: {
        type: Sequelize.JSON,
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
    return queryInterface.dropTable('Visits');
  },
};
