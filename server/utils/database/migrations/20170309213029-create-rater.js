module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Raters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      about: {
        type: Sequelize.TEXT,
      },
      occupation: {
        type: Sequelize.STRING,
      },
      photo_url: {
        type: Sequelize.STRING,
      },
      user_id: {
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
    return queryInterface.dropTable('Raters');
  },
};
