module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Providers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      telephone_number: {
        type: Sequelize.STRING,
      },
      info_files_urls: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      contact_person_info: {
        type: Sequelize.JSON,
      },
      contact_information: {
        type: Sequelize.JSON,
      },
      general_news: {
        type: Sequelize.TEXT,
      },
      about: {
        type: Sequelize.TEXT,
      },
      number_of_employees: {
        type: Sequelize.INTEGER,
      },
      foundation_year: {
        type: Sequelize.DATE,
      },
      hours_of_operation: {
        type: Sequelize.JSON,
      },
      rating: {
        type: Sequelize.FLOAT,
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
    return queryInterface.dropTable('Providers');
  },
};
