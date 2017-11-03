module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Subservices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      metatags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      service_id: {
        type: Sequelize.INTEGER,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('Subservices');
  },
};
