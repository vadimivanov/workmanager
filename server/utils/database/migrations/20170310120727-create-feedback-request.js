module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('FeedbackRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      job_title: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.TEXT,
      },
      photo_urls: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      rater_email: {
        type: Sequelize.STRING,
      },
      rater_id: {
        type: Sequelize.INTEGER,
      },
      provider_id: {
        type: Sequelize.INTEGER,
      },
      service_id: {
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
    return queryInterface.dropTable('FeedbackRequests');
  },
};
